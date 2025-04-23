# import requests

# def download_video(blob_url, save_path):
#     try:
#         response = requests.get(blob_url, stream=True)
#         response.raise_for_status()  # Kiểm tra lỗi HTTP
        
#         with open(save_path, 'wb') as file:
#             for chunk in response.iter_content(chunk_size=8192):
#                 file.write(chunk)
#         print(f"Video đã được tải xuống và lưu tại {save_path}")
        
#     except requests.exceptions.RequestException as e:
#         print(f"Đã xảy ra lỗi khi tải xuống video: {e}")

# # Thay 'your_blob_url_here' và 'path_to_save_video' bằng URL và đường dẫn lưu của bạn
# blob_url = 'your_blob_url_here'
# save_path = 'path_to_save_video.mp4'

# download_video(blob_url, save_path)
import os
import requests

def download_video(blob_url, save_directory):
    try:
        # Tạo thư mục nếu chưa tồn tại
        os.makedirs(save_directory, exist_ok=True)
        
        # Tên file lưu trữ sẽ là 'video.mp4'
        save_path = os.path.join(save_directory, 'video.mp4')
        
        # Tải xuống video
        response = requests.get(blob_url, stream=True)
        response.raise_for_status()  # Kiểm tra lỗi HTTP
        
        with open(save_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        
        print(f"Video đã được tải xuống và lưu tại {save_path}")
        
    except requests.exceptions.RequestException as e:
        print(f"Đã xảy ra lỗi khi tải xuống video: {e}")
    except OSError as e:
        print(f"Lỗi khi lưu video: {e}")

# Ví dụ: Tải xuống video vào ổ đĩa D
blob_url = 'blob:https://play.stream4.me/3cf71247-889f-44d6-8cf8-bb90881ae9e1'
save_directory = 'D:/'  # Đường dẫn đầy đủ đến ổ đĩa D và thư mục Videos

download_video(blob_url, save_directory)
