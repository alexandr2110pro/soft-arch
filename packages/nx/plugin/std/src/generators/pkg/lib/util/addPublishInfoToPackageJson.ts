import { type Tree, joinPathFragments, readJson, updateJson } from '@nx/devkit';
import { z } from 'zod';

const PackageJsonSchema = z.object({
  repository: z.object({
    type: z.string(),
    url: z.string(),
    directory: z.string(),
  }),
  homepage: z.string(),
  bugs: z.record(z.string(), z.string()),
  author: z.string(),
  license: z.string(),
});

export function addPublishInfoToPackageJson(tree: Tree, projectPath: string) {
  const packageJsonPath = joinPathFragments(projectPath, 'package.json');

  const rootPackageJson = readJson(tree, 'package.json');

  const { repository, homepage, bugs, author, license } =
    PackageJsonSchema.parse(rootPackageJson);

  updateJson(tree, packageJsonPath, json => {
    return Object.assign(json, {
      publishConfig: {
        access: 'public',
      },
      homepage,
      bugs,
      author,
      license,
      repository: {
        ...repository,
        directory: joinPathFragments(repository.directory, projectPath),
      },
    });
  });
}
