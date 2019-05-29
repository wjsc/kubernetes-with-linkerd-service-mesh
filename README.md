
## Build docker images
```
docker build -t wjsc/crash:latest ./servers/crash
docker build -t wjsc/crash-random:latest ./servers/crash-random
docker build -t wjsc/fail:latest ./servers/fail
docker build -t wjsc/fail-random:latest ./servers/fail-random
docker build -t wjsc/stop:latest ./servers/stop
docker build -t wjsc/timeout:latest ./servers/timeout
docker build -t wjsc/work:latest ./servers/work
```

## Run containers
```
docker run -p 3001:80 -d wjsc/crash
docker run -p 3002:80 -d wjsc/crash-random
docker run -p 3003:80 -d wjsc/fail
docker run -p 3004:80 -d wjsc/fail-random
docker run -p 3005:80 -d wjsc/stop
docker run -p 3006:80 -d wjsc/timeout
docker run -p 3007:80 -d wjsc/work
```

## Run Kubernetes Cluster
```
kubectl apply -f ./servers/crash/k8s-deployment.yml
kubectl apply -f ./servers/crash/k8s-service.yml
kubectl apply -f ./servers/crash/k8s-hpa.yml
kubectl apply -f ./servers/crash-random/k8s-deployment.yml
kubectl apply -f ./servers/crash-random/k8s-service.yml
kubectl apply -f ./servers/crash-random/k8s-hpa.yml
kubectl apply -f ./servers/fail/k8s-deployment.yml
kubectl apply -f ./servers/fail/k8s-service.yml
kubectl apply -f ./servers/fail/k8s-hpa.yml
kubectl apply -f ./servers/fail-random/k8s-deployment.yml
kubectl apply -f ./servers/fail-random/k8s-service.yml
kubectl apply -f ./servers/fail-random/k8s-hpa.yml
kubectl apply -f ./servers/stop/k8s-deployment.yml
kubectl apply -f ./servers/stop/k8s-service.yml
kubectl apply -f ./servers/stop/k8s-hpa.yml
kubectl apply -f ./servers/timeout/k8s-deployment.yml
kubectl apply -f ./servers/timeout/k8s-service.yml
kubectl apply -f ./servers/timeout/k8s-hpa.yml
kubectl apply -f ./servers/work/k8s-deployment.yml
kubectl apply -f ./servers/work/k8s-service.yml
kubectl apply -f ./servers/work/k8s-hpa.yml
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
minikube addons enable metrics-server
kubectl logs -f pod/service/deployment
```