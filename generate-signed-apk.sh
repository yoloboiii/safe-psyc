set -eu

trap 'cd - > /dev/null' EXIT
cd android
./gradlew assembleReleased
echo "The APK can be found at $(readlink -f ./app/build/outputs/apk/app-release.apk)"
