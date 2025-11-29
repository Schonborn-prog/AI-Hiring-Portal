from app.core.supabase_client import supabase

def download_resume(file_path: str) -> bytes:
    """
    Downloads a file from the Supabase Storage bucket 'resumes'
    Returns the raw file bytes.
    """
    response = supabase.storage.from_("resumes").download(file_path)

    if isinstance(response, bytes):
        return response

    # If the response is not bytes, it's an error
    raise Exception("Failed to download file: " + str(response))
