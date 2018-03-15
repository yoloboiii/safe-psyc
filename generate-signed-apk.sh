set -eu

ABS_WD=$(dirname $(readlink -f $0))


function placeKeyStore {
    cp "$ABS_WD/SECRETS/safe-psyc-release-privkey.keystore" "$ABS_WD/android/app"
}

function removeKeyStore {
    rm -f "$ABS_WD/android/app/safe-psyc-release-privkey.keystore"
}


function placeGradlePropertiesSecrets {
    cat "$ABS_WD/SECRETS/release-gradle-properties" >> "$ABS_WD/android/gradle.properties"
}

function removeGradlePropertiesSecrets {
    sed -i '/RELEASE_/d' "$ABS_WD/android/gradle.properties"
}


function cleanup {
    cd - > /dev/null

    removeGradlePropertiesSecrets
    removeKeyStore
}


trap cleanup EXIT


placeGradlePropertiesSecrets
placeKeyStore

cd android
./gradlew assembleRelease


APK_PATH=$(readlink -f "$ABS_WD/android/app/build/outputs/apk/release/app-release.apk")
RELATIVE_APK_PATH=$(realpath --relative-to="$ABS_WD" "$APK_PATH")

echo
echo
echo
echo "The APK can be found at $APK_PATH"

command -v xclip >/dev/null 2>&1 && {
    echo -n "$APK_PATH" | xclip -selection clipboard
    echo "I put the path in your clipboard"
}

echo
echo "You can install the apk by running"
echo "adb install -r ./$RELATIVE_APK_PATH"
echo
echo
echo "Please make sure there is no .keystore file in android/app"
echo "and no RELEASE_ keys in android/gradle.properties"
echo

