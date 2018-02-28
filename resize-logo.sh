function resize {
    size=$1
    dpi=$2

    set -x
    convert logo.png -resize $size android/app/src/main/res/mipmap-$dpi/ic_launcher.png
    set +x
}


resize "72x72" hdpi
resize "48x48" mdpi
resize "96x96" xhdpi
resize "144x144" xxhdpi
resize "192x192" xxxhdpi
