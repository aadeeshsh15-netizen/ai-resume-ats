import docx
import zipfile
import xml.etree.ElementTree as ET
import re

def extract_text_from_docx(file_path: str) -> str:
    """
    Comprehensive text extraction from DOCX files.
    Extracts text from paragraphs, tables, headers, footers, and textboxes.
    """
    extracted_chunks = []
    
    # 1. Primary extraction using python-docx
    try:
        doc = docx.Document(file_path)
        
        # Headers
        for section in doc.sections:
            for p in section.header.paragraphs:
                if p.text.strip():
                    extracted_chunks.append(p.text.strip())
            for t in section.header.tables:
                for row in t.rows:
                    for cell in row.cells:
                        for p in cell.paragraphs:
                            if p.text.strip():
                                extracted_chunks.append(p.text.strip())
                                
        # Main body paragraphs
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                extracted_chunks.append(paragraph.text.strip())
                
        # Tables (multi-column tables, skill grids, sidebars)
        for table in doc.tables:
            for row in table.rows:
                row_texts = []
                for cell in row.cells:
                    cell_p = [p.text.strip() for p in cell.paragraphs if p.text.strip()]
                    if cell_p:
                        row_texts.append(" ".join(cell_p))
                if row_texts:
                    extracted_chunks.append(" | ".join(row_texts))
                    
        # Footers
        for section in doc.sections:
            for p in section.footer.paragraphs:
                if p.text.strip():
                    extracted_chunks.append(p.text.strip())
                    
    except Exception as e:
        pass
        
    # 2. Extract text from Textboxes (w:txbxContent) and SDT blocks inside XML
    try:
        with zipfile.ZipFile(file_path, 'r') as z:
            for name in z.namelist():
                if name.startswith('word/') and name.endswith('.xml') and not name.startswith('word/_rels'):
                    xml_content = z.read(name).decode('utf-8', errors='ignore')
                    root = ET.fromstring(xml_content)
                    
                    # Extract text from textboxes
                    for txbx in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}txbxContent'):
                        txbx_texts = []
                        for t in txbx.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                            if t.text and t.text.strip():
                                txbx_texts.append(t.text.strip())
                        if txbx_texts:
                            extracted_chunks.append(" ".join(txbx_texts))
    except Exception as e:
        pass
        
    # 3. Fallback: If still empty, extract all <w:t> tags directly
    if not extracted_chunks:
        try:
            with zipfile.ZipFile(file_path, 'r') as z:
                for name in z.namelist():
                    if name.startswith('word/') and name.endswith('.xml') and ('document' in name or 'header' in name):
                        xml_content = z.read(name).decode('utf-8', errors='ignore')
                        root = ET.fromstring(xml_content)
                        for t in root.iter():
                            if t.tag.endswith('}t') and t.text and t.text.strip():
                                extracted_chunks.append(t.text.strip())
        except Exception as e:
            pass
            
    if not extracted_chunks:
        raise ValueError("No extractable text found in the DOCX document.")
        
    # Deduplicate redundant consecutive lines while preserving order
    seen = set()
    result = []
    for chunk in extracted_chunks:
        c_clean = chunk.strip()
        if c_clean and c_clean not in seen:
            seen.add(c_clean)
            result.append(c_clean)
            
    return "\n".join(result)
