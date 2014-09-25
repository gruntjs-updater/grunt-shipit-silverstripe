# grunt-shipit-silverstripe

Shipit SilverStripe is a plugin for automating SilverStripe tasks when deploying sites with the [Shipit](https://github.com/neoziro/grunt-shipit) deployment tool for Grunt.js.

**Note: This is very much a beta release! Use caution when implementing it in a production environment!**

## Getting Started
**Prior to installing this plugin, it's recommended that you install and configure [Shipit](https://github.com/neoziro/grunt-shipit) first.**

This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-shipit-silverstripe --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-shipit-silverstripe');
```

## Options

The options for this plugin uses the same configuration as Shipit. However, there are a few options that have been added.

### linkedFiles

Type: `Array<String>`

An array of files to symlink to the current `release` from the `shared` directory.

### linkedDirs

Type: `Array<String>`

An array of paths to symlink to the current `release` from the `shared` directory.

### host

Type: `String`

Full domain name of the website. This must match the domain name that will be used within a browser when the site is visited.

### Example Configuration

```js
  grunt.initConfig({
    shipit: {
      options: {
        // Project will be build in this directory.
        workspace: '/tmp/'+pkg.name,

        // Project will be deployed in this directory.
        deployTo: '/home/username/application',

        // Repository url.
        repositoryUrl: pkg.repository.url,

        // This files will not be transfered.
        ignores: ['.git', 'node_modules'],

        // Number of release to keep (for rollback).
        keepReleases: 5,

        // Default git branch; Comment out to force manual entry of branch
        // from CLI or environment variable
        // branch: 'master',

        // Array of files to link in shared directory.
        linkedFiles: ['_ss_environment.php', 'robots.txt'],

        // Array of directories to link in shared directory.
        linkedDirs: ['assets', 'silverstripe-cache', 'vendor'],

        // Full domain name of site
        host: 'www.hostname.com'

      },

      // Staging environment.
      staging: {
        servers: 'username@staging.hostname.com',
        host: 'staging.hostname.com',
        deployTo: '/home/username/application',
        branch: 'develop'
      }
    }
  });
```

Options can be assigned globally or to a specific environment.

## Tasks

By default, SilverStripe related tasks are set to run with the standard Shipit `deploy` and `rollback` tasks. Tasks can be executed independently by adding the task after a Shipit call:

```
grunt shipit:<stage> <task>
```

### ss:shared

Updates links from shared files and directories to current release.

### ss:composer

Runs a Composer update for the current release.

### ss:devbuild

Runs a SilverStripe dev/build process

### db:backup

Perform backup of current database

### db:purge

Purge older backups of database

### db:restore

Restore previous database from backup

## Configuration

### Shared Files and Directories

For shared files and directories, create a directory called `shared` within the `deployTo` path. Upload all files and directories you wish to be shared across all releases. Be sure and update the `linkedFiles` and `linkedDirs` options so that symlinks are created for each new release added.

*Note: The `ss:shared` task cannot create directories that don't exist when symlinks are created. If a path includes directories that don't exist, you'll need to make sure and update your repository to include the directories prior to deployment.*

### SilverStripe Environment

In order for the `ss:devbuild` task to properly flush the cache after a `dev/build`, you'll need to update your `_ss_environment.php` to allow for a URL paramager for the `SS_ENVIRONMENT_TYPE`:

```php
$env_type = isset($_GET['env_type']) ? $_GET['env_type'] : 'dev';
define('SS_ENVIRONMENT_TYPE', $env_type);
```

Also, in order for `sake` to run a `dev/build` on the server, you'll need to update your `_ss_environment.php` config so that it includes the `_FILE_TO_URL_MAPPING` variable:

```php
// This is used by sake to know which directory points to which URL
global $_FILE_TO_URL_MAPPING;
$_FILE_TO_URL_MAPPING[realpath('/var/www/public_html')] = 'http://www.yoursite.com';
```

More information about this can be found on the [SilverStripe Documentation](http://doc.silverstripe.org/framework/en/topics/commandline) site.

### Database

In order to keep credentials secure for database tasks, a file must be uploaded to your `shared` directory. Create a file called `database.json` with the following contents updated with the correct credentials:

```js
{
    "staging": {
        "host": "localhost",
        "database": "database",
        "username": "username",
        "password": "password"
    }
}
```


