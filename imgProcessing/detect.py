import numpy as np
import cv2
from scipy.spatial import distance as dist
import imutils

from imutils import paths
from imutils import perspective
for imagePath in paths.list_images("./cards"):
	print imagePath

cap = cv2.VideoCapture(1)
while(True):
    # Capture frame-by-frame
    ret, frame = cap.read()

    # Our operations on the frame come here
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray,(3,3),0)
    # flag, thresh = cv2.threshold(blur, 100, 255, cv2.THRESH_BINARY)


    # thresh = cv2.Canny(blur, 85, 255)
    thresh = imutils.auto_canny(blur)
    kernel = np.ones((2,2), np.uint8)
    thresh = cv2.dilate(thresh, kernel, iterations=1)

    cv2.imshow('thresh',thresh)
    img, contours, hierarchy = cv2.findContours(thresh,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    cardCountour = np.array([])
    for contour in contours:
        (x,y,w,h) = cv2.boundingRect(contour)

        perimeter = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, 0.05 * perimeter, True)

        if (w > 80 and h > 80 and len(approx) == 4 and cv2.isContourConvex(approx)):
            cv2.rectangle(frame, (x,y), (x+w,y+h), (255, 225, 225), 1)
            cardCountour = approx

    # cv2.drawContours(frame, [cardCountour], -1, (0, 255, 0), 2)
    cv2.imshow('frame',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    if (len(cardCountour) == 4):
        warped = cv2.resize(perspective.four_point_transform(frame, cardCountour.reshape(4, 2)), (1000, 600), interpolation = cv2.INTER_CUBIC)


        # Display the resulting frame
        cv2.imshow('warped',warped)

# When everything done, release the capture
cap.release()
