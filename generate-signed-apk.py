#! /usr/bin/env python

from subprocess import call
import os
import sys
import shutil

def chdir_to_script_dir():
    os.chdir(os.path.dirname(__file__))


# We're using a bunch of paths relative to the script dir, so
# make sure to use the script dir as the cwd
call_path = os.getcwd()
chdir_to_script_dir()

gradle_properties  = os.path.abspath("./android/gradle.properties")
key_store = os.path.abspath("./android/app/safe-psyc-release-privkey.keystore")

rel_apk_path = rel_to_call_path("./android/app/build/outputs/apk/release/app-release.apk")
abs_apk_path = os.path.abspath(rel_apk_path)


class BuildException(Exception):
    pass
class SecretsException(Exception):
    pass


def install_secrets():
    print "Installing secrets..."
    install_gradle_properties()
    install_key_store()

def install_gradle_properties():
    gradle_secrets_file = os.path.abspath("./SECRETS/release-gradle-properties")
    ensure_secret_exists(gradle_secrets_file)

    with open(gradle_secrets_file, "r") as f:
        gradle_secrets = f.read()

    with open(gradle_properties, "a") as f:
        f.write(gradle_secrets)

    print "  * gradle.properties secrets installed"

def ensure_secret_exists(path):
    if not os.path.isfile(path):
        print
        print "unable to find {}, perhaps you haven't decrypted the secrets?".format(path)
        print_decrypt_help()
        raise SecretsException(path)

def install_key_store():
    key_store_file = os.path.abspath("./SECRETS/safe-psyc-release-privkey.keystore")
    ensure_secret_exists(key_store_file)

    shutil.copyfile(key_store_file, key_store)
    print "  * keystore installed"

def remove_secrets():
    print "Removing secrets..."
    remove_gradle_secrets()
    remove_key_store()

def remove_gradle_secrets():
    # adapted from https://stackoverflow.com/a/28057753

    with open(gradle_properties,"r+") as f:
        lines = f.readlines()

        f.seek(0)
        for line in lines:
            line_starts_with_release = line.startswith("RELEASE")
            if not line_starts_with_release:
                f.write(line)

        f.truncate()
    print "  * gradle.properties secrets removed"

def remove_key_store():
    if os.path.isfile(key_store):
        os.remove(key_store)
        print "  * keystore removed"


def build_apk():
    try:
        sys.stdout.write("Building APK...")
        sys.stdout.flush()

        os.chdir('android')
        exit_code = os.system("./gradlew assembleRelease")
        if exit_code != 0:
            raise BuildException("build script exited with code {}".format(exit_code))

        print
    finally:
        os.chdir('..')


def rel_to_call_path(path):
    return "./{}".format(os.path.relpath(path, call_path))

def print_apk_path():
    print "The APK can be found at {}".format(abs_apk_path)

def copy_apk_path_to_clipboard():
    xclip_exists = which("xclip") is not None

    if xclip_exists:
        os.system("echo -n \"{}\" | xclip -selection clipboard".format(abs_apk_path))
        print "I put the path in your clipboard"

def which(program):
    # taken from https://stackoverflow.com/a/377028
    # could probably be replaced by os.system("command {}".format(program))
    def is_exe(fpath):
        return os.path.isfile(fpath) and os.access(fpath, os.X_OK)

    fpath, fname = os.path.split(program)
    if fpath:
        if is_exe(program):
            return program
    else:
        for path in os.environ["PATH"].split(os.pathsep):
            exe_file = os.path.join(path, program)
            if is_exe(exe_file):
                return exe_file

    return None

def print_install_help():
    print "You can install the apk by running"
    print "adb install -r {}".format(rel_apk_path)

def print_testfairy_instructions():
    testfairy_script = rel_to_call_path('./testfairy-uploader.sh')
    api_key_file = "./SECRETS/testfairy-api-key"
    api_key_file_is_readable = os.path.isfile(api_key_file) and os.access(api_key_file, os.R_OK)

    if api_key_file_is_readable:
        with open(api_key_file, "r") as f:
            testfairy_api_key = f.read().strip()

            print "You can upload it to testfairy by running"
            print "{} {} {}".format(testfairy_script, testfairy_api_key, rel_apk_path)
    else:
        print "You can upload it to testfairy by running"
        print "{} testfairy-api-key {}".format(testfairy_script, rel_apk_path)
        print "The API key can be found in {}, but you don't seem to have decrypted the secrets".format(api_key_file)
        print_decrypt_help()

def print_decrypt_help():
    print "You can decrypt the secrets by running"
    print "{} {}".format(
        rel_to_call_path("./decrypt-folder"),
        rel_to_call_path("./SECRETS.tar.gpg"),
    )

def print_secrets_warning():
    print "Please make sure there is no .keystore file in {}".format(dirname_relative(key_store))
    print "and no RELEASE_ keys in {}".format(abs_to_rel(gradle_properties))

def abs_to_rel(abspath):
    return "./{}".format(os.path.relpath(gradle_properties, call_path))

def dirname_relative(abspath):
    relpath = abs_to_rel(abspath)
    return "{}/".format(os.path.dirname(relpath))

try:
    install_secrets()
    print

    build_apk()


    print
    print

    print_apk_path()
    copy_apk_path_to_clipboard()
    print
    print_install_help()
    print
    print_testfairy_instructions()
    print
except SecretsException as e:
    pass
except BuildException as e:
    pass

finally:
    print
    remove_secrets()
    print
    print_secrets_warning()
    print

