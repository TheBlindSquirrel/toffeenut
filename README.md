# Toffeenut

## Design Psychology
Toffeenut is intended to be a small library of fitness functions. It is not intended to be large framework, like Jasmine, that allows you create your tests. Toffeenut instead contains a set of tests that you run against your code base.

## Installation
Toffeenut is available as an npm package. To install simply enter
    
    npm i toffeenut

## Setup
After installing toffeenut you'll need to run init once. Make sure you run init at the same level as package.json and any other configs you have in your project (ie eslist.json, ionic.config.json, tsconfig.config.json).

    npx toffeenut init
Init will create a ``toffeenut.config.json`` file.

## Running Tests

### Test Config
Each test has a section in the ``toffeenut.config.json``. One common property that all tests have is an ``enabled`` field. If enabled is not present or set to true then the test will be executed when toffeenut runs. To disable a test set enabled to false.

    {
        ...
        "checkPackageJson": {
            "enabled": false
        }
        ...
    }

### Check Package JSON
This test goes through the package.json file (assumed to be at the same level as ``toffeenut.config.json``) and checks the dependencies and devDepencies to make sure that all versions are pinned, no [special version characters](https://nodejs.dev/learn/semantic-versioning-using-npm) (^, ~, latest, etc). Below are the allowed config values for ``Check Package Json`` test. Packages that are pinned using ``=`` will pass.

Config Name | Default Value | Description
:---------: | :-----------: | :--:
Enabled     | true          | If the test should be run
Path        | "./"          | The path to the package.json file

