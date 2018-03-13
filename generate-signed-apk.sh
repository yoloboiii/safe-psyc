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


echo
echo
echo
echo "The APK can be found at $(readlink -f ./app/build/outputs/apk/release/app-release.apk)"
echo
echo "Please make sure there is no .keystore file in android/app"
echo "and no RELEASE_ keys in android/gradle.properties"

