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

**since 0.0.2**

Config Name | Default Value | Description               | Required
:---------: | :-----------: | :---------:               | :--:
allowGithub | true | If true any packages installed directly from a git server will be allowed | false

**since 0.0.3**
Config Name | Default Value | Description               | Required
:---------: | :-----------: | :---------:               | :--:
requireGitCommit     | false          | This test will only run if allowGithub flag is also true. If true all packages installed from git must be pinned to a specific commit. | false


### **Single Export**
**since 0.0.2**

This test goes through every ts file and makes sure each files only has a single export.

Config Name | Default Value | Description               | Required
:---------: | :-----------: | :---------:               | :--:
enabled     | true          | If the test should be run | false
rootPath | '' | The root folder to search through for all ts files  | true


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
**since 0.0.2**

This test checks that colors are defined only in a single file. It uses a regex to check for hex colors and rgba defined colors in scss files.

Config Name | Default Value | Description               | Required
:---------: | :-----------: | :---------:               | :--:
enabled     | true          | If the test should be run | false
colorsFilePath | '' | The path to the file that contains all of the color variables  | true
checkForRGBA | true | If true this test will also check if rgb/rgba colors are defined anywhere other than the colors file | false
ignoreFiles | [] | An array of files and directories that should be ignored. Set this if you import a theme or 3rd party library that you do not want to be checked. | false
rootPath | '' | All the files under this path will be checked. It can be either a theme folder or the root/src folder when you want to check all the scss files & html files. | true
checkHTML | true |If true all html & htm files will be checked for hex colors and also rgba colors when that test is enabled. | false
### **No !Import in styles**
**since TBD**

This test will fail if there are any !important styles in your styles.
Config Name | Default Value | Description               | Required
:---------: | :-----------: | :---------:               | :--:
enabled     | true          | If the test should be run | false
ignoreFilePath | '' | All files under this path will be ignored. Set this if you import a theme or 3rd party library that you do not want to be checked. | false

### **Import Statement Tests**
**since TBD**

These tests will prevent src/app or require src/app in the import statements.

### **Duplicate String Test**
**since TBD**

This test scans the code base for strings of the minimum length that are duplicates of each other. Intention is to find strings that could be extracted into a resource file or duplicate HTTP calls that can be shared.
