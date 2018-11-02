import os
import base64
from pprint import pprint as pp


DEFAULT_DIRECTORIES_TO_AVOID = set(['./.git', './env', './logs'])
DEFAULT_FILE_EXTENSIONS_TO_AVOID = set(['pyc', '.log'])


def getAllFilesWPathsInDirectory(directory):

    all_files_with_paths = []

    for root, dirs, files in os.walk('.'):
        if shouldAvoidDirectory(root):
            continue

        for file in files:
            if shouldAvoidFileExtension(file):
                continue

            full_file_and_path = '/'.join([root, file])
            all_files_with_paths.append(full_file_and_path)

    return all_files_with_paths


def shouldAvoidDirectory(root, dirsToAvoid=DEFAULT_DIRECTORIES_TO_AVOID):

    subPaths = root.split('/')

    for i, subPath in enumerate(subPaths):
        dir = '/'.join(subPaths[:i+1])

        if dir in dirsToAvoid:
            return True

    return False


def shouldAvoidFileExtension(file, extensionsToAvoid=DEFAULT_FILE_EXTENSIONS_TO_AVOID):

    extension = file.split('.')[-1]

    if extension in extensionsToAvoid:
        return True

    return False
