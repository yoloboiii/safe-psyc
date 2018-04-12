set -eu

ABS_WD="$( cd "$(dirname "$0")" ; pwd -P )"


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


function getShortestAPKPath {
    if command -v realpath >/dev/null 2>&1; then
        realpath --relative-to="$ABS_WD" "$APK_PATH"
    else
        echo "$APK_PATH"
    fi
}


trap cleanup EXIT


placeGradlePropertiesSecrets
placeKeyStore

cd android
./gradlew assembleRelease


APK_PATH="$ABS_WD/android/app/build/outputs/apk/release/app-release.apk"
SHORTEST_APK_PATH=$(getShortestAPKPath)

if [ -f "$ABS_WD/SECRETS/testfairy-api-key" ]; then
   TESTFAIRY_API_KEY=$(< "$ABS_WD/SECRETS/testfairy-api-key")
else
   TESTFAIRY_API_KEY="testfairy-api-key"
fi

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
echo "adb install -r ./$SHORTEST_APK_PATH"
echo
echo "You can upload it to testfairy by running"
echo "./testfairy-uploader.sh $TESTFAIRY_API_KEY ./$SHORTEST_APK_PATH"
echo
echo "Please make sure there is no .keystore file in android/app"
echo "and no RELEASE_ keys in android/gradle.properties"
echo

