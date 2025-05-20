import cv2
import numpy as np
import pytesseract
from pytesseract import Output
import layoutparser as lp
import json

class ImageToTextConverter:
    def __init__(self, tesseract_config=None):
        self.tesseract_config = tesseract_config if tesseract_config else r'--oem 3 --psm 6'

    def deskew_image(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        coords = np.column_stack(np.where(binary > 0))
        angle = cv2.minAreaRect(coords)[-1]

        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        if abs(angle) > 10:
            angle = 0

        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        deskewed = cv2.warpAffine(image, M, (w, h),
                                  flags=cv2.INTER_CUBIC,
                                  borderMode=cv2.BORDER_REPLICATE)
        return deskewed

    def run_tesseract_ocr(self, image, return_annotated_image=False):
        ocr_data = pytesseract.image_to_data(image, config=self.tesseract_config, output_type=Output.DICT)
        if return_annotated_image:
            annotated_image = image.copy()
            n_boxes = len(ocr_data['level'])

            for i in range(n_boxes):
                text = ocr_data['text'][i].strip()
                if text != "":
                    (x, y, w, h) = (ocr_data['left'][i], ocr_data['top'][i],
                                    ocr_data['width'][i], ocr_data['height'][i])
                    cv2.rectangle(annotated_image, (x, y), (x + w, y + h), (0, 255, 0), 2)
                    cv2.putText(annotated_image, text, (x, y - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            return ocr_data, annotated_image

        return ocr_data

    def run_layoutparser(self, image, return_annotated_image=False):
        model = lp.Detectron2LayoutModel(
            config_path='lp://PubLayNet/faster_rcnn_R_50_FPN_3x/config',
            label_map={0: "Text", 1: "Title", 2: "List", 3: "Table", 4: "Figure"},
            extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", "0.5"]
        )
        layout = model.detect(image)

        if return_annotated_image:
            annotated = lp.draw_box(image.copy(), layout, box_width=3, show_element_type=True)
            return layout, annotated

        return layout

    def extract_text_from_image(self, image_path, deskew=True, use_layoutparser=False):
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image from path: {image_path}")

        processed_image = self.deskew_image(image) if deskew else image

        if use_layoutparser:
            layout = self.run_layoutparser(processed_image)
            ocr_data = self.run_tesseract_ocr(processed_image)
        else:
            ocr_data = self.run_tesseract_ocr(processed_image)

        extracted_text = ' '.join([text for text in ocr_data['text'] if text.strip() != ''])
        return extracted_text

    @staticmethod
    def save_text_to_file(text, filename="extracted_text.txt"):
        with open(filename, "w") as file:
            file.write(text)

    @staticmethod
    def save_data_to_json(data, filename="extracted_data.json"):
        with open(filename, "w") as json_file:
            json.dump(data, json_file, indent=4)
