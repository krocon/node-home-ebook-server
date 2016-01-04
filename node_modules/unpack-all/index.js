(function () {
    'use strict';

    // see http://unarchiver.c3.cx/commandline
    // unar and lsar

    var log = require('npmlog');
    var quote = require('shell-quote').quote;
    var child_process = require('child_process');
    var exec = child_process.exec;
    var os = require('os');


    module.exports = unpackAll.list = unpackAll;

    var archiveTypePattern = /: [A-Z,7]*$/g;

    //var osType = os.type().toLowerCase();
    //var isMac = function () {
    //    return osType === 'darwin';
    //};
    //var isLinux = function () {
    //    return osType === 'linux';
    //};
    //var isWindows = function () {
    //    return osType.indexOf('win')>-1;
    //};

    var escapeFileName = function(s) {
        return '"'+s+'"';
        //if (isWindows()) return '"'+s+'"';
        //// '"'+cmd.replace(/(["\s'$`\\])/g,'\\$1')+'"'
        //return s;
    };

    var defaultListCallback = function (err, files, text) {
        if (err) return log.error(err);

        if (files) log.info('files', files);
        if (text) log.info('text' , text);
    };

    var isInt = function isInt(x) {
        return !isNaN(x) && eval(x).toString().length == parseInt(eval(x)).toString().length;
    };


    unpackAll.defaultListFilter = function defaultListFilter(s) {
        return s && s != ''
            && s.indexOf('\r') == -1
            && s.indexOf('\n') == -1
            && !s.match(archiveTypePattern);
    };

    unpackAll.unpack = function unpack(archiveFile, options, callback) {
        if (!archiveFile) archiveFile = options.archiveFile;
        if (!archiveFile) return log.error("Error: archiveFile or options.archiveFile missing.");

        if (!callback) callback = defaultListCallback;
        if (!options) options = {};

        // Unar command:
        var unar = options.unar;
        if (!unar) unar = 'unar';
        var ar = [unar];

        // Archive file (source):
        ar.push('SOURCEFILE');
        //ar.push(archiveFile);

        // -output-directory (-o) <string>: The directory to write the contents of the archive to. Defaults to the current directory.
        ar.push('-o');
        var targetDir = options.targetDir;
        if (!targetDir) targetDir = path.join(os.tmpdir(), 'tmp');
        ar.push(targetDir);

        // -force-overwrite (-f): Always overwrite files when a file to be unpacked already exists on disk. By default, the program asks the user if possible, otherwise skips the file.
        if (options.forceOverwrite) ar.push('-f');

        // -force-rename (-r): Always rename files when a file to be unpacked already exists on disk.
        if (options.forceRename) ar.push('-r');

        // -force-skip (-s): Always skip files when a file to be unpacked already exists on disk.
        if (options.forceSkip) ar.push('-s');

        // -force-directory (-d): Always create a containing directory for the contents of the unpacked archive. By default, a directory is created if there is more than one top-level file or folder.
        if (options.forceDirectory) ar.push('-d');

        // -no-directory (-D): Never create a containing directory for the contents of the unpacked archive.
        if (options.noDirectory) ar.push('-D');

        // -no-recursion (-nr): Do not attempt to extract archives contained in other archives. For instance, when unpacking a .tar.gz file, only unpack the .gz file and not its contents.
        if (options.noRecursion) ar.push('-nr');

        // -copy-time (-t): Copy the file modification time from the archive file to the containing directory, if one is created.
        if (options.copyTime) ar.push('-t');

        // -quiet (-q): Run in quiet mode.
        if (options.quiet) ar.push('-q');

        // -password (-p) <string>: The password to use for decrypting protected archives.
        if (options.password) {
            ar.push('-p');
            ar.push(options.password);
        }
        // -password-encoding (-E) <name>: The encoding to use for the password for the archive, when it is not known. If not specified, then either the encoding given by the -encoding option or the auto-detected encoding is used.
        if (options.passwordEncoding) {
            ar.push('-E');
            ar.push(options.passwordEncoding);
        }

        // -encoding (-e) <encoding name>: The encoding to use for filenames in the archive, when it is not known. If not specified, the program attempts to auto-detect the encoding used. Use "help" or "list" as the argument to give
        if (options.encoding) {
            ar.push('-e');
            ar.push(options.encoding);
        }

        if (options.indexes) {
            // -indexes (-i): Instead of specifying the files to unpack as filenames or wildcard patterns, specify them as indexes, as output by lsar.
            if (Array.isArray(options.indexes)) {
                options.indexes.forEach(function (idx) {
                    ar.push('-i');
                    ar.push(''+idx); // string!
                });
            } else if (isInt(options.indexes)) {
                console.error('options.indexes must be an array of integer, but it is: ' + JSON.stringify(options.indexes))
            }
        } else if (options.files) {
            if (Array.isArray(options.files)) {
                options.files.forEach(function (s) {
                    ar.push(s);
                });
            } else {
                ar.push(options.files);
            }
        }

        if (!options.quiet) log.info('command', quote(ar));

        var cmd  = quote(ar).replace('SOURCEFILE', escapeFileName(archiveFile));
        if (!options.quiet) log.info('cmd', cmd);
        exec(cmd, function (err, stdout, stderr) {
            if (err) return callback(err, null);
            if (stderr && stderr.length > 0) return callback('Error: ' + stderr, null);
            if (stdout && stdout.length > 0) {
                if (stdout.indexOf('No files extracted')>-1) return callback('Error: No files extracted', null);
            }

            callback(null, targetDir, stdout);
        });
    }; // unpackAll.unpack

    unpackAll.list = function list(archiveFile, options, callback) {
        if (!archiveFile) archiveFile = options.archiveFile;
        if (!archiveFile) return log.error("Error: archiveFile or options.archiveFile missing.");
        if (!callback) callback = defaultListCallback;

        if (!options) options = {};

        // Unar command:
        var lsar = options.lsar;
        if (!lsar) lsar = 'lsar';
        var ar = [lsar];

        // Archive file (source):
        ar.push('SOURCEFILE');

        // -no-recursion (-nr): Do not attempt to extract archives contained in other archives. For instance, when unpacking a .tar.gz file, only unpack the .gz file and not its contents.
        if (options.noRecursion) ar.push('-nr');

        // -password (-p) <string>: The password to use for decrypting protected archives.
        if (options.password) {
            ar.push('-p');
            ar.push(options.password);
        }
        // -password-encoding (-E) <name>: The encoding to use for the password for the archive, when it is not known. If not specified, then either the encoding given by the -encoding option or the auto-detected encoding is used.
        if (options.passwordEncoding) {
            ar.push('-E');
            ar.push(options.passwordEncoding);
        }

        // -encoding (-e) <encoding name>: The encoding to use for filenames in the archive, when it is not known. If not specified, the program attempts to auto-detect the encoding used. Use "help" or "list" as the argument to give
        if (options.encoding) {
            ar.push('-e');
            ar.push(options.encoding);
        }

        // -print-encoding (-pe): Print the auto-detected encoding and the confidence factor after the file list
        if (options.printEncoding) {
            ar.push('-pe');
            ar.push(options.printEncoding);
        }

        // -json (-j): Print the listing in JSON format.
        if (options.json) ar.push('-j');

        // -json-ascii (-ja): Print the listing in JSON format, encoded as pure ASCII text.
        if (options.jsonAscii) ar.push('-ja');

        var cmd  = quote(ar).replace('SOURCEFILE', escapeFileName(archiveFile));
        if (!options.quiet) log.info('cmd', cmd);
        exec(cmd, function (err, stdout, stderr) {
            if (err) return callback(err, null);
            if (stderr && stderr.length > 0) return callback('Error: ' + stderr, null);

            var lines = stdout.split(/(\r?\n)/g);
            if (lines.length > 0) {
                var files = lines.filter(unpackAll.defaultListFilter);
                return callback(null, files);

            } else {
                return callback('Error: no files foound in archive. ' + stderr, null);
            }
        });
    }; // unpackAll.list

    unpackAll();

    function unpackAll() {
    }

})();