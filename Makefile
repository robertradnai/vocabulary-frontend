
.PHONY: build
build:
	docker build -t vocabulary_front_end .

.PHONY: run_container
run_container:
	docker network create -d bridge vocabulary || :
	docker run --rm --network="vocabulary" -it -p 4200:80 vocabulary_front_end
