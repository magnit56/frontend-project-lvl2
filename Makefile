install:
	npm ci
publish:
	npm publish --dry-run
link:
	npm link
lint:
	npx eslint bin/ src/
lint-fix:
	npx eslint --fix bin/ src/
test:
	npx jest
