

## 1. Build docker images
```
docker build -t wjsc/client:latest ./client
docker build -t wjsc/crash-random:latest ./servers/crash-random
docker build -t wjsc/fail-random:latest ./servers/fail-random
docker build -t wjsc/stop:latest ./servers/stop
docker build -t wjsc/timeout-random:latest ./servers/timeout-random
docker build -t wjsc/work:latest ./servers/work

// Delete old docker images
docker image prune -f
```

## 2. Launch cluster and Linkerd 
```
// Start cluster
minikube start --vm-driver=none

// Install linkerd Control Plane
linkerd install | kubectl apply -f -

// Enable ingress (only first time run)
minikube addons enable ingress

// Enable metrics server (only first time run)
minikube addons enable metrics-server

```

## 3. Apply Kubernetes Files
```
kubectl apply -f ./k8s-namespace.yml
kubectl apply -f ./k8s-ingress.yml
kubectl apply -f ./client/k8s-service.yml
kubectl apply -f ./client/k8s-service-profile.yml
kubectl apply -f ./client/k8s-deployment.yml
kubectl apply -f ./client/k8s-hpa.yml
kubectl apply -f ./servers/_remote/k8s-service.yml
kubectl apply -f ./servers/_remote/k8s-service-profile.yml
kubectl apply -f ./servers/crash-random/k8s-service.yml
kubectl apply -f ./servers/crash-random/k8s-deployment.yml
kubectl apply -f ./servers/crash-random/k8s-hpa.yml
kubectl apply -f ./servers/crash-random/k8s-service-profile.yml
kubectl apply -f ./servers/fail-random/k8s-service.yml
kubectl apply -f ./servers/fail-random/k8s-deployment.yml
kubectl apply -f ./servers/fail-random/k8s-hpa.yml
kubectl apply -f ./servers/fail-random/k8s-service-profile.yml
kubectl apply -f ./servers/stop/k8s-service.yml
kubectl apply -f ./servers/stop/k8s-deployment.yml
kubectl apply -f ./servers/stop/k8s-hpa.yml
kubectl apply -f ./servers/stop/k8s-service-profile.yml
kubectl apply -f ./servers/timeout-random/k8s-service.yml
kubectl apply -f ./servers/timeout-random/k8s-deployment.yml
kubectl apply -f ./servers/timeout-random/k8s-hpa.yml
kubectl apply -f ./servers/timeout-random/k8s-service-profile.yml
kubectl apply -f ./servers/work/k8s-service.yml
kubectl apply -f ./servers/work/k8s-deployment.yml
kubectl apply -f ./servers/work/k8s-hpa.yml
kubectl apply -f ./servers/work/k8s-service-profile.yml

```

## 4. Inject Linkerd Sidecars
```
kubectl get -n resilience deploy -o yaml | linkerd inject - | kubectl apply -f -

```

## Run containers
```
docker run -p 3000:80 -d wjsc/client
docker run -p 3002:80 -d wjsc/crash-random
docker run -p 3004:80 -d wjsc/fail-random
docker run -p 3005:80 -d wjsc/stop
docker run -p 3006:80 -d wjsc/timeout-random
docker run -p 3007:80 -d wjsc/work
```

## Misc
```
minikube stop
minikube delete
minikube start --vm-driver=none
kubectl create -f deployment.yml --save-config
kubectl apply -f deployment.yml
kubectl delete deployment work-deployment
minikube addons list
kubectl logs -f pod
kubectl logs -f --selector app=fail-random -n resilience -c fail-random
kubectl logs -f --selector app=timeout-random -n resilience -c timeout-random
kubectl logs -f --selector app=client -n resilience -c client
kubectl exec -it <pod-name> -n <namespace> -- sh
watch -n2 kubectl get all -n resilience

curl -XGET $(minikube -n resilience service client-service --url) -i
watch -n0.1 curl -XGET $(minikube -n resilience service client-service --url) -i

// Client Modification
kubectl delete deployments.apps client-deployment -n resilience
docker build -t wjsc/client:latest ./client
kubectl apply -f ./client/k8s-deployment.yml
kubectl get -n resilience deploy -o yaml | linkerd inject - | kubectl apply -f -

// Server Modification
kubectl delete deployments.apps fail-random-deployment -n resilience
docker build -t wjsc/fail-random:latest ./servers/fail-random
kubectl apply -f ./servers/fail-random/k8s-deployment.yml

// Linkerd
export PATH=$PATH:$HOME/.linkerd2/bin
linkerd check --pre
linkerd install | kubectl apply -f -
linkerd checkkubectl delete deployments.apps client-deployment -n resilience
docker build -t wjsc/client:latest ./client
kubectl apply -f ./client/k8s-deployment.yml
kubectl get -n resilience deploy -o yaml | linkerd inject - | kubectl apply -f -

linkerd -n resilience check --proxy

// Profile template generation
linkerd profile -n resilience fail-random-service --template

// Scale down
kubectl scale -n resilience deployment.apps/fail-random-deployment --replicas=1

// Uninject
kubectl get --all-namespaces daemonset,deploy,job,statefulset \
    -l "linkerd.io/control-plane-ns" -o yaml \
  | linkerd uninject - \
  | kubectl apply -f -

// Install curl on alpine
apk add --no-cache curl

// Watch routes
linkerd -n resilience routes deploy/client-deployment --to svc/fail-random-service

//Remote service
echo '127.0.0.1 www.remote.com' >> /etc/hosts

// Curl to ingress
curl -XGET http://localhost/ -kLi
```

## Using kubens to Swith namespaces
```
// Download kubens
curl -XGET https://raw.githubusercontent.com/ahmetb/kubectx/master/kubens --output ~/kubens
chmod +x ~/kubens
mv ~/kubens /usr/bin

// Switch context to resilience namespace
kubens resilience
```



In macOS you need to run this command before building the docker images
```
eval $(minikube docker-env)
```
This is required to actually utilise docker daemon running on minikube, and henceforth build your image on the minikubes docker and thus expect it to be available to the minikubes k8s engine without pulling from external registry.



## Scenario

1. Start transaction
2. CLIENT send network REQUEST-A to SERVICE-A
3. SERVICE-A process REQUEST-A
4. SERVICE-A send RESPONSE-A to CLIENT
5. CLIENT process RESPONSE-A
6. CLIENT send REQUEST-B to SERVICE-B
7. SERVICE-B process RESPONSE-B
8. SERVICE-B send RESPONSE-B to CLIENT
9. CLIENT process RESPONSE-B
10. Commit transaction

### Errors

1. REQUEST-A Network Error
    Network Resilience mechanism + Idempotent
        More errors => No consistency error

2. SERVICE-A Process Error
    a. App error: 
        i. Pre Process Error => No consistency error
        ii. Post Process Error => Consistency error
    b. Infrastructure error: Network Resilience mechanism + Idempotent

3. RESPONSE-A Network Error
    Network Resilience mechanism + Idempotent

4. CLIENT Process Error
    Nothing to do -> Unrecoverable consistency error

5. REQUEST-B Network Error
    Network Resilience mechanism + Idempotent

6. SERVICE-B Process Error
    a. App error: Recoverable consistency error -> Revert REQUEST-A -> Notify the User
    b. Infrastructure error: Network Resilience mechanism + Idempotent

7. RESPONSE-B Network Error
    Network Resilience mechanism + Idempotent

8. Revert REQUEST-A Network Error

9. Revert REQUEST-A Process Error
    a. App error: Unrecoverable consistency error
    b. Infrastructure error: Network Resilience mechanism + Idempotent

10. Revert REQUEST-A Response Network Error
