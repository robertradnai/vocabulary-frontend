CONFIGURATION=""

.PHONY: build
build:
	echo Configuration: ${CONFIGURATION}
	docker build -t vocabulary_front_end --build-arg CONFIGURATION=${CONFIGURATION} .

.PHONY: run_container
run_container:
	docker network create -d bridge vocabulary || :
	docker run --rm --network="vocabulary" -it -p 4200:80 vocabulary_front_end
