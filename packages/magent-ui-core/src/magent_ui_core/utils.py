def attempt_import(module):
    try:
        return __import__(module)
    except ImportError:
        return None


def is_community_installed():
    return attempt_import('langchain_community') is not None


def is_in_array_or_has_prefix(string_array, target_string):
    """
    Check if the target_string is in the string_array or starts with any of the elements in the string_array.

    :param string_array: List of strings to check against.
    :param target_string: The target string to check.
    :return: True if target_string is in string_array or starts with any element in string_array, False otherwise.
    """
    # Check if the target_string is directly in the string_array
    if target_string in string_array:
        return True

    # Check if the target_string starts with any string in the string_array
    for prefix in string_array:
        if target_string.startswith(prefix):
            return True

    return False


def is_ipython() -> bool:
    """
    Check if interface is launching from iPython
    :return is_ipython (bool): True or False
    """
    is_ipython = False
    try:  # Check if running interactively using ipython.
        from IPython import get_ipython  # type: ignore

        if get_ipython() is not None:
            is_ipython = True
    except (ImportError, NameError):
        pass
    return is_ipython


def attempt_import(module):
    try:
        return __import__(module)
    except ImportError:
        return None
