//
'use strict';

//
var _fs = require('fs');
var _path = require('path');
var _ = require('underscore');

// add func |endsWith| to String
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function is_file(path) {
    var fstat = null;
    try {
        fstat = _fs.statSync(path);
    } catch (err) {
        return false;
    }
    return fstat && fstat.isFile();
}

function find_executable(prog) {
    // 8f1kRCu
    var env_var_PATHEXT = process.env.PATHEXT;
    /// can be |undefined|

    // 6qhHTHF
    // split into a list of extensions
    var ext_s = !env_var_PATHEXT ? [] : env_var_PATHEXT.split(_path.delimiter);

    // 2pGJrMW
    // strip
    ext_s = _.map(ext_s, function (ext) {
        return ext.trim();
    });

    // 2gqeHHl
    // remove empty
    ext_s = _.filter(ext_s, function (ext) {
        return ext !== '';
    });

    // 2zdGM8W
    // convert to lowercase
    ext_s = _.map(ext_s, function (ext) {
        return ext.toLowerCase();
    });

    // 2fT8aRB
    // uniquify
    ext_s = _.uniq(ext_s);

    // 4ysaQVN
    var env_var_PATH = process.env.PATH;
    /// can be |undefined|
    ///
    /// if has value, there is an ending |;| in it,
    ///  which results in an ending empty string for the splitting at 3zVznlK

    // 6mPI0lg
    var dir_path_s = !env_var_PATH ? [] : env_var_PATH.split(_path.delimiter);
    /// 3zVznlK

    // 5rT49zI
    // insert empty dir path to the beginning
    //
    // Empty dir handles the case that |prog| is a path, either relative or absolute.
    // See code 7rO7NIN.
    dir_path_s.unshift('');

    // 2klTv20
    // uniquify
    dir_path_s = _.uniq(dir_path_s);

    // 6bFwhbv
    var exe_path_s = [];
    _.each(dir_path_s, function (dir_path) {
        // 7rO7NIN
        // synthesize a path with the dir and prog
        var path = _path.join(dir_path, prog);

        // 6kZa5cq
        // assume the path has extension, check if it is an executable
        if (_.any(ext_s, function (ext) {
            return path.endsWith(ext);
        })) {
            if (is_file(path)) {
                exe_path_s.push(path);
            }
        }

        // 2sJhhEV
        // assume the path has no extension
        _.each(ext_s, function (ext) {
            // 6k9X6GP
            // synthesize a new path with the path and the executable extension
            var path_plus_ext = path + ext;
            // 6kabzQg
            // check if it is an executable
            if (is_file(path_plus_ext)) {
                exe_path_s.push(path_plus_ext);
            }
        });
    });

    // 8swW6Av
    // uniquify
    exe_path_s = _.uniq(exe_path_s);

    //
    return exe_path_s;
}

function print(txt) {
    process.stdout.write(txt + '\n');
}

function main() {
    // 9mlJlKg
    // check if one cmd arg is given
    var arg_s = process.argv.slice(2);

    if (arg_s.length != 1) {
        // 7rOUXFo
        // print program usage
        print('Usage: aoikwinwhich PROG');
        print('');
        print('#/ PROG can be either name or path');
        print('aoikwinwhich notepad.exe');
        print('aoikwinwhich C:\\Windows\\notepad.exe');
        print('');
        print('#/ PROG can be either absolute or relative');
        print('aoikwinwhich C:\\Windows\\notepad.exe');
        print('aoikwinwhich Windows\\notepad.exe');
        print('');
        print('#/ PROG can be either with or without extension');
        print('aoikwinwhich notepad.exe');
        print('aoikwinwhich notepad');
        print('aoikwinwhich C:\\Windows\\notepad.exe');
        print('aoikwinwhich C:\\Windows\\notepad');

        // 3nqHnP7
        return;
    }

    // 9m5B08H
    // get name or path of a program from cmd arg
    var prog = arg_s[0];

    // 8ulvPXM
    // find executables
    var path_s = find_executable(prog);

    // 5fWrcaF
    // has found none, exit
    if (!path_s.length) {
        // 3uswpx0
        return;
    }

    // 9xPCWuS
    // has found some, output
    var txt = path_s.join('\n');

    print(txt);

    // 4s1yY1b
    return;
}

//
exports.main = main;

//
if (require.main == module) {
    main();
}
