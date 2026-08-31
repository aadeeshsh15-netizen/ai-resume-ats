import pypdf

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from a PDF file with fallback modes.
    """
    try:
        text = ""
        with open(file_path, "rb") as f:
            reader = pypdf.PdfReader(f)
            for page_idx, page in enumerate(reader.pages):
                page_text = ""
                # Try standard text extraction
                try:
                    page_text = page.extract_text()
                except Exception:
                    page_text = ""
                    
                # If standard extraction was empty, try layout mode
                if not page_text or not page_text.strip():
                    try:
                        page_text = page.extract_text(extraction_mode="layout")
                    except Exception:
                        pass
                        
                if page_text and page_text.strip():
                    text += page_text + "\n\n"
                    
        if not text or not text.strip():
            raise ValueError("No extractable text found in the PDF.")
            
        return text
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")
