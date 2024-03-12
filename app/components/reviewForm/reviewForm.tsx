'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import styles from './page.module.css';
import x from '../../../public/x.png';
import Image from 'next/image';
import Link from 'next/link';
import upload from '../../../public/upload3.png';
import filledStar from '../../../public/regularStar.png';
import unfilledStar from '../../../public/unfilledStar.png';

interface ReviewFormProps {
  showReviewForm: boolean; //
  setShowReviewForm: React.Dispatch<React.SetStateAction<boolean>>;
  spotName: string | undefined;
  spotId: string | undefined;
  userId: string | undefined;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  showReviewForm,
  setShowReviewForm,
  spotName,
  spotId,
  userId,
}) => {
  const [reviewContent, setReviewContent] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [storedRating, setStoredRating] = useState<number>(0);
  const [photoURLs, setPhotoURLs] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [awsURLs, setAwsURLs] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReviewContent(e.target.value);
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (selectedRating == 0) {
  //     setFormError('Please select a rating');
  //     scrollToForm();
  //     return;
  //   }
  //   if (reviewContent == '') {
  //     setFormError('Please write a review');
  //     scrollToForm();
  //     return;
  //   }
  // };

  const handleShowReviewForm = () => {
    showReviewForm ? setShowReviewForm(false) : setShowReviewForm(true);
  };

  const handleFileInput = () => {
    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    }
  };

  const scrollToForm = () => {
    if (formRef.current) {
      console.log(formRef.current);
      formRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  const handlePhotosChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (photos.length == 5) {
      setFormError('Photo limit exceeded: 5 photos max');
      window.scrollTo(0, 400);
      return;
    }
    const files = e.target.files;

    if (files) {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length + photos.length > 5) {
        setFormError('Photo limit exceeded: 5 photos max');
        window.scrollTo(0, 400);
        return;
      }
      setPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPhotoURLs((prevURLs) => [...prevURLs, ...urls]);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    const updatedPhotos = photos.filter((_, index) => index !== indexToRemove);
    const updatedPhotoURLs = photoURLs.filter(
      (_, index) => index !== indexToRemove
    );

    setPhotos(updatedPhotos);
    setPhotoURLs(updatedPhotoURLs);

    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    setStoredRating(rating);
    console.log(rating);
  };

  const handleStarHover = (rating: number) => {
    setSelectedRating(rating);
    console.log(rating);
  };
  const handleStarLeave = (rating: number) => {
    setSelectedRating(storedRating);
    console.log(rating);
  };

  //submit funcitonality
  useEffect(() => {
    const saveReview = async () => {
      const reviewData = {
        content: reviewContent,
        rating: storedRating,
        photos: awsURLs,
        authorId: userId,
        studySpotId: spotId,
      };
      console.log(reviewData);
      try {
        const response = await fetch('/api/createReview/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        });

        if (response.ok) {
          // Handle success
          console.log('Review created successfully');
        } else {
          // Handle failure
          console.error('Failed to create review');
        }
      } catch (error) {
        console.error('Error creating review:', error);
      }
    };
    if (awsURLs.length != 0) {
      saveReview();
      handleShowReviewForm();
      window.location.reload;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awsURLs]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await savePhotos();
  };

  const savePhotos = async () => {
    const urls: string[] = [];
    for (let i = 0; i < photos.length; i++) {
      const file = photos[i];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const uploadResponse = await fetch('/api/uploadPhotoReview/', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const { fileURL } = await uploadResponse.json();
          // console.log(fileURL);
          urls.push(fileURL);
        } else {
          console.error(`Failed to get photo URLs ${i}`);
        }
      } catch (error) {
        console.error(`Error uploading photo ${i}:`, error);
      }
    }
    console.log(urls);
    setAwsURLs(urls);
  };

  return (
    <div className={styles.formDiv}>
      <div onClick={handleShowReviewForm} className={styles.overlay}></div>
      <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
        {formError && <p className={styles.formError}>{formError}</p>}
        <Image
          onClick={handleShowReviewForm}
          className={styles.x}
          src={x}
          alt="X"
          height={25}
          width={25}
        />
        <div className={styles.inputDiv}>
          <label htmlFor="description" className={styles.header}>
            Write review
          </label>
          <p className={styles.desc}>
            Share the pros, cons and what to expect when studying at {spotName}
          </p>
          <textarea
            value={reviewContent}
            onChange={handleContentChange}
            name="description"
            // required
            className={styles.textArea}
          />
        </div>

        <div className={styles.inputDiv}>
          <label htmlFor="hours" className={styles.header}>
            Attach Photos
          </label>
          <p className={styles.desc}>
            Show us what the study spot is really like. You can attach up to 5
            photos in your review!
          </p>
          {photos.length != 0 && (
            <div className={styles.photos}>
              {photoURLs.map((url, index) => (
                <div key={`photo-${url}`} className={styles.photoPreview}>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className={styles.removePhoto}
                  >
                    <Image src={x} alt="x" height={20} width={20} />
                  </button>
                  <Image
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className={styles.uploadedPhotoPreview}
                    width={150}
                    height={300}
                  />
                </div>
              ))}
            </div>
          )}
          <label
            onClick={handleFileInput}
            htmlFor="photos"
            className={styles.fileLabel}
          >
            <Image src={upload} alt="" height={50} width={50} />
            <p className={styles.filePreview}>Click to browse files</p>
            <input
              type="file"
              name="photos"
              className={styles.fileInput}
              accept=".jpg, .jpeg, .png"
              onChange={handlePhotosChange}
              multiple
            />
          </label>
        </div>
        <div className={styles.inputDiv}>
          <label htmlFor="description" className={styles.header}>
            Give a rating
          </label>
          <p className={styles.desc}>Select Rating</p>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((rating) => {
              const isFilled = rating <= (selectedRating || 0);
              return (
                <>
                  {isFilled ? (
                    <span
                      key={rating}
                      className={styles.star}
                      onClick={() => handleStarClick(rating)}
                      onMouseEnter={() => handleStarHover(rating)}
                      onMouseLeave={() => handleStarLeave(selectedRating)}
                    >
                      <Image src={filledStar} alt={`star-${rating}`} />
                    </span>
                  ) : (
                    <span
                      key={rating}
                      className={styles.starEmpty}
                      onClick={() => handleStarClick(rating)}
                      onMouseEnter={() => handleStarHover(rating)}
                      onMouseLeave={() => handleStarLeave(selectedRating)}
                    >
                      <Image src={unfilledStar} alt={`star-${rating}`} />
                    </span>
                  )}
                </>
              );
            })}
          </div>
        </div>
        <div className={styles.buttons}>
          <button type="submit" className={styles.submit}>
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
