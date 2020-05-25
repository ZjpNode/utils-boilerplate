<h1 align="center"><strong>utils-boilerplate</strong></h1>

基于`rollup`+`typescript`的工具类库模板

## 特性
- 使用`jest`进行单元测试，同时使用`power-assert`作为断言库；
- 使用`commitizen`规范`git commit`提交(用`git-cz`代替`git`进行提交)；
- 使用`husky`对`git`提交的信息进行校验；
- 使用`standard-version`进行版本发布；
- 使用`typescript-is`对运行时参数进行校验；
- 使用`typedoc`根据注释生成文档；

## Prerequisites
Node.js (>=10.x, 13.x preferred), npm version 5+ (npx) and Git.

## Dependent 
- @babel/core
- rollup
- jest
- majestic
- eslint
- commitizen
- standard-version
- husky
- typescript
- ttypescript
- typescript-is
- typedoc
- ... ...

## Usage
```
git clone https://github.com/nicejade/vue-boilerplate-template (your-project-name)
cd your-project-name
npm install
npm build
```