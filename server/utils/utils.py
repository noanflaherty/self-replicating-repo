import os
import base64
from pprint import pprint as pp


def getAllFilesWPathsInDirectory(directory, dirsToAvoid=set(), extensionsToAvoid=set()):
    """
    Expects a string as the input that represents the directory to begin walking
    from. For example, '.' will begin the traversal at the top-level directory.

    Returns a list of file names with their complete paths (relative to the
    start directory.)
    """

    all_files_with_paths = []

    for root, dirs, files in os.walk(directory):
        if shouldAvoidDirectory(root, dirsToAvoid):
            continue

        for file in files:
            if shouldAvoidFileExtension(file, extensionsToAvoid):
                continue

            full_file_and_path = '/'.join([root, file])
            all_files_with_paths.append(full_file_and_path)

    return all_files_with_paths


def shouldAvoidDirectory(root, dirsToAvoid):
    """
    Given a directory (root, of type string) and a set of directory
    paths to avoid (dirsToAvoid, of type set of strings), return a boolean value
    describing whether the file is in that directory to avoid.
    """

    subPaths = root.split('/')

    for i, subPath in enumerate(subPaths):
        dir = '/'.join(subPaths[:i+1])

        if dir in dirsToAvoid:
            return True

    return False


def shouldAvoidFileExtension(file, extensionsToAvoid):
    """
    Given a file name and its path (file, of type string) and a set of file
    extensions types to avoid (extensionsToAvoid, of type set of strings),
    return a boolean value describing whether the file is of that extension.
    """

    extension = file.split('.')[-1]

    if extension in extensionsToAvoid:
        return True

    return False
