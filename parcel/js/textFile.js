// This is a work around from
// https://github.com/parcel-bundler/parcel/issues/1736
// (see Context section)

import fs from "fs";

const textFile = fs.readFileSync(__dirname + "/textFile.txt", "utf8");

export default textFile;