import * as core from "@actions/core";
import { globSync } from "fast-glob";
import * as fs from "node:fs";
import * as path from "node:path";
import * as semver from "semver";

try {
  const prefix: string = core.getInput("prefix");
  const type: string = core.getInput("type");

  if (type !== "patch" && type !== "minor" && type !== "major") {
    throw new Error(`Invalid type "${type}"`);
  }

  const pkgPath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(pkgPath)) {
    throw new Error("package.json file does not exist");
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as {
    version?: string;
    workspaces?: { packages?: string[] };
  };

  const version = semver.parse(pkg.version);
  const packages = pkg.workspaces?.packages ?? [];

  if (version == null) {
    throw new Error("package.json does not have a valid version");
  }

  const oldVersion = version.toString();
  const newVersion = version.inc(type).toString();
  const toReplace = `"version": "${oldVersion}"`;

  globSync(["package.json", ...packages.map((item) => path.join(item, "package.json"))], {
    ignore: ["node_modules"],
  }).forEach((name) => {
    const file = path.join(process.cwd(), name);
    const text = fs.readFileSync(file, "utf-8");

    if (!text.includes(toReplace)) {
      throw new Error(`${name} does not contain ${toReplace}`);
    }

    const nextText = text.replace(toReplace, `"version": "${newVersion}"`);
    fs.writeFileSync(file, nextText, "utf-8");
  });

  core.setOutput("old_version", prefix + oldVersion);
  core.setOutput("new_version", prefix + newVersion);
} catch (error) {
  console.error(error);
  process.exit(1);
}
