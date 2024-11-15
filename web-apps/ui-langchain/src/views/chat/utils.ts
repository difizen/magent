export const allowedVideoExtension = ['mp4', 'mkv', 'avi', 'mov', 'webm'];

// video/mp4
export const isAllowedVideoType = (type?: string) => {
  if (!type) {
    return false;
  }
  const _type = type.toLowerCase();
  if (!_type.startsWith('video')) {
    return false;
  }

  if (allowedVideoExtension.find((ext) => _type.endsWith(ext))) {
    return true;
  }
  return false;
};

export const allowedImageExtension = ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'webp'];

// image/jpg
export const isAllowedImageType = (type?: string) => {
  if (!type) {
    return false;
  }
  const _type = type.toLowerCase();
  if (!_type.startsWith('image')) {
    return false;
  }

  if (allowedImageExtension.find((ext) => _type.endsWith(ext))) {
    return true;
  }
  return false;
};

// 获取文件后缀
export const getExtension = (url: string) => {
  const match = url.match(/\.([^./]+)$/);
  return match ? match[1] : '';
};

// 获取视频信息
const getVideoPlayerInfo = (file: File) => {
  //通过将file对象通过URL.createObjectURL这个方法，转换成video实体DOM，
  // 再根据loadedmetadata这个事件获取到视频的一些相关信息，因为事件本身是异步的，所以封装成了一个Promise
  return new Promise((resolve) => {
    const videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(file);
    videoElement.addEventListener('loadedmetadata', function () {
      if (videoElement.duration > 0.5) {
        videoElement.currentTime = 0.1;
      }
      resolve({
        duration: videoElement.duration,
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
    });
  });
};

// 获取视频信息
export const getVideoThumb = (file: File): Promise<{ thumb: string }> => {
  //通过将file对象通过URL.createObjectURL这个方法，转换成video实体DOM，
  // 再根据loadedmetadata这个事件获取到视频的一些相关信息，因为事件本身是异步的，所以封装成了一个Promise
  return new Promise((resolve) => {
    const videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(file);
    videoElement.addEventListener('loadedmetadata', function () {
      if (videoElement.duration > 0.5) {
        videoElement.currentTime = 0.4;
      }
    });

    videoElement.addEventListener('seeked', function () {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx!.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const thumb = canvas.toDataURL();
      resolve({
        thumb: thumb,
      });
    });
  });
};

export const checkFile = async (file: File | undefined) => {
  if (!file) {
    return;
  }
  try {
    const videoInfo = await getVideoPlayerInfo(file);
    const { duration, width, height } = videoInfo as any;

    // 视频分辨率小于1080p(1920 * 1080)，时长小于等于5分钟
    return duration <= 5 * 60 && width * height <= 2073600; // 1920 * 1080
  } catch {
    return false;
  }
};

export const getImgSize = (file: File) => {
  const image = new Image();
  image.src = URL.createObjectURL(file);

  return new Promise((resolve) => {
    image.onload = () => {
      const width = image.width;
      const height = image.height;
      resolve({ width, height });
    };
  });
};

export const uploadFileAsBase64 = async (file: File | undefined) => {
  if (!file) {
    return '';
  }

  // Convert the file to a Base64 encoded string
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  try {
    const base64String = await readFileAsBase64(file);
    return base64String;
  } catch (error) {
    console.error('Error converting file to Base64:', error);
    return '';
  }
};

// export const uploadFile = async (file: File | undefined) => {
//   if (!file) {
//     return;
//   }
//   const formData = new FormData();
//   formData.append('image', file);
//   const { success, data } = await getPolicy({
//     fileType: 'MULTIMODAL_IMG',
//   });

//   if (success && data?.host) {
//     const params: Record<string, any> = {
//       key: `${data.dir}${encodeURI(file.name)}`,
//       OSSAccessKeyId: data.accessId!,
//       policy: data.policy!,
//       signature: data.signature!,
//       success_action_status: 200,
//       file,
//     };
//     const formData = new FormData();
//     Object.keys(params).forEach((key) => formData.append(key, params[key]));

//     await fetch(data.host!, {
//       method: 'POST',
//       mode: 'no-cors',
//       body: formData,
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//     });

//     const { success, data: imgData } = await imageUrl(
//       `${data.host}/${data.dir}${encodeURI(encodeURI(file.name))}`,
//     );
//     if (success && imgData) {
//       return imgData;
//     }
//   }
//   return '';
// };
