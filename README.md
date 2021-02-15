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

## Toffeenut Config
Each test has a section in the ``toffeenut.config.json``. One common property that all tests have is an ``enabled`` field. If enabled is not present or set to true then the test will be executed when toffeenut runs. To disable a test set enabled to false.

    {
        ...
        "checkPackageJson": {
            "enabled": false
        }
        ...
    }
If any section is omitted or removed from the config that test will not be run.

### **Check Package JSON**
**since 0.0.1**

This test goes through the package.json file (assumed to be at the same level as ``toffeenut.config.json``) and checks the dependencies and devDepencies to make sure that all versions are pinned, no [special version characters](https://nodejs.dev/learn/semantic-versioning-using-npm) (^, ~, etc). Packages that are pinned using ``=`` will pass. Below are the allowed config values for ``Check Package Json`` test.

Config Name | Default Value | Description               | Required
:---------: | :-----------: | :---------:               | :--:
enabled     | true          | If the test should be run | false

### **Single Export**
**since 0.0.2**

This test goes through every js/ts file and makes sure each files only has a single export.

Config Name | Default Value | Description               | Required
:---------: | :-----------: | :---------:               | :--:
enabled     | true          | If the test should be run | false
rootPath | '' | The root folder to search through for all ts/js  | true


### **Plugin Only Called Once**
**since TDB**

This test will search through all ts/js files under the supplied root folder looking for files that call the supplied plugins.

### **File Referenced Outside Folder**
**since TDB**

This test looks for references to files outside of their parent folder. The intention of this test is to find things that may need to be split out into a shared service.

Config Name | Default Value | Description               | Required
:---------: | :-----------: | :---------:               | :--:
enabled     | true          | If the test should be run | false
rootPath | '' | The root folder to search through for all ts/js  | true
treatAsWarning | false | If true this test will only print a warning for each outside folder reference found. | false

### **Interface Implemented**
**since TDB**

This test looks to see if interfaces are implemented in any other class

### **Limit Hex Colors**
**since TDB**

This test checks all scss files for hex color values.
