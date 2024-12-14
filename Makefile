init:
	cd microservice/qr && make init && make build_jvm && \
	cd ../auth && make init && make build_jvm

