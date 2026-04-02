.PHONY: dev build preview clean deploy

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

clean:
	rm -rf dist node_modules/.vite

deploy: build
	git add -A && git commit -m "Deploy" && git push origin main
