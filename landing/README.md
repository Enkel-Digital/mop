# landing
MOP's landing page

## Project setup
### Installing Dependencies
```
npm install
```
Note that there might be some dependency issues, due to @vue/cli-plugin-eslint package's v4.5.11 peer dependency specifying use of eslint < v7.0.0 and other related issues.  
These issues should be fixed once the vue clie hits v5.0.0 release, but for now, use ```npm install --legacy-peer-deps``` or ```npm install --force``` to get around it

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Adding pre-rendering build process
- Install the pre render plugin into dev dependencies
    ```
    npm install -D prerender-spa-plugin
    ```
- Uncomment the prerendering build process code in vue.config.js
- Uncomment the event dispatching code in main.js