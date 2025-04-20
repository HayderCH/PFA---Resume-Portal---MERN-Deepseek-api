import cv2
import numpy as np
import pytesseract
from pytesseract import Output
import layoutparser as lp
import matplotlib.pyplot as plt 

def deskew_image(image):
    """
    Deskews the image using thresholding and the minAreaRect method.
    """
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Binarize image using Otsu's thresholding
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Find coordinates of all non-zero pixels
    coords = np.column_stack(np.where(binary > 0))
    angle = cv2.minAreaRect(coords)[-1]
    
    # The 'angle' is in the range [-90, 0); adjust it
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle

    # Limit rotation to small angles (avoid full 90 degree rotation)
    if abs(angle) > 10:
        angle = 0  # Don't apply any extreme rotation, we can add a smaller threshold.

    # Rotate image to deskew it
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    deskewed = cv2.warpAffine(image, M, (w, h),
                              flags=cv2.INTER_CUBIC,
                              borderMode=cv2.BORDER_REPLICATE)
    return deskewed

def run_tesseract_ocr(image):
    """
    Runs Tesseract OCR on the image and draws bounding boxes with recognized text.
    Returns both the OCR data (as a dict) and the annotated image.
    """
    # Configure Tesseract:
    # --oem 3 uses the default engine, and --psm 6 assumes a uniform block of text.
    custom_config = r'--oem 3 --psm 6'
    ocr_data = pytesseract.image_to_data(image, config=custom_config, output_type=Output.DICT)
    
    # Copy image for annotation
    annotated_image = image.copy()
    n_boxes = len(ocr_data['level'])
    
    for i in range(n_boxes):
        text = ocr_data['text'][i].strip()
        if text != "":
            (x, y, w, h) = (ocr_data['left'][i], ocr_data['top'][i],
                            ocr_data['width'][i], ocr_data['height'][i])
            # Draw rectangle and put text
            cv2.rectangle(annotated_image, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(annotated_image, text, (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
    return ocr_data, annotated_image

def run_layoutparser(image):
    """
    Runs a pre-trained LayoutParser model (PubLayNet) to detect layout blocks.
    Returns the detected layout and an image annotated with bounding boxes.
    """
    # Load the pre-trained LayoutParser model
    model = lp.Detectron2LayoutModel(
        config_path='lp://PubLayNet/faster_rcnn_R_50_FPN_3x/config',
        label_map={0: "Text", 1: "Title", 2: "List", 3: "Table", 4: "Figure"},
        extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", "0.5"]
    )
    layout = model.detect(image)
    
    # Draw detected layout blocks on the image.
    annotated = lp.draw_box(image.copy(), layout, box_width=3, show_element_type=True)
    return layout, annotated

import json
def save_text_to_file(ocr_data, filename="extracted_text.txt"):
    with open(filename, "w") as file:
        for i, text in enumerate(ocr_data['text']):
            if text.strip() != "":
                file.write(f"Box {i}: {text.strip()}\n")

# Function to save OCR data to a .json file
def save_data_to_json(ocr_data, filename="extracted_data.json"):
    with open(filename, "w") as json_file:
        json.dump(ocr_data, json_file, indent=4)

        
if __name__ == "__main__":
    # 1. Load the resume image (update this path to your image file)
    image_path = "resume_sample.jpg"  # <-- Change to your image path
    image = cv2.imread(image_path)
    if image is None:
        print("Error: Could not load image. Check the path.")
        exit(1)
    
    # 2. Pre-process the image: deskew it
    deskewed_image = deskew_image(image)
    cv2.imwrite("deskewed_resume.jpg", deskewed_image)
    print("Deskewed image saved as 'deskewed_resume.jpg'")

    # 3. Run Tesseract OCR to extract text and annotate bounding boxes
    ocr_data, ocr_annotated = run_tesseract_ocr(deskewed_image)
    cv2.imwrite("ocr_annotated.jpg", ocr_annotated)
    print("OCR annotated image saved as 'ocr_annotated.jpg'")

 # 6. Save OCR extracted text to file
    save_text_to_file(ocr_data)
    print("OCR text saved to 'extracted_text.txt'")

    # 7. Save OCR extracted data (text + metadata) to a JSON file
    save_data_to_json(ocr_data)
    print("OCR data saved to 'extracted_data.json'")
    # 4. Run



