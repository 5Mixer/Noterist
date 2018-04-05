import cv2
import numpy as np

frame = cv2.imread("./10.jpg") 
kernel = np.ones((5,5), np.uint8)

hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

lower_red = np.array([15,80,50])
upper_red = np.array([90,255,255])

mask = cv2.inRange(hsv, lower_red, upper_red)
mask = cv2.dilate(mask, kernel, iterations=1)
img, contours, hierarchy = cv2.findContours(mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
res = cv2.bitwise_and(frame,frame, mask= mask)

for contour in contours:
    (x,y,w,h) = cv2.boundingRect(contour)
    if (w > 50 and h > 20 and w > h*2):
        cv2.rectangle(res, (x,y), (x+w,y+h), (255, 225, 225), 1)

cv2.imwrite("./10p.jpg",res)

while(1):
    cv2.imshow("frame",frame)
    cv2.imshow("mask",mask)
    cv2.imshow("res",res)

    k = cv2.waitKey(5) & 0xFF
    if k == 27:
        break

cv2.destroyAllWindows()
cap.release()
