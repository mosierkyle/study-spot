'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import upload from '../../../public/upload3.png';
import x from '../../../public/x2.png';
import { School, User } from '@prisma/client';
import filledStar from '../../../public/regularStar.png';
import unfilledStar from '../../../public/unfilledStar.png';
import ReviewStars from '../reviewStars/reviewStars';
import { useRouter } from 'next/navigation';

interface StudySpotFormProps {
  schoolData: School | null;
  userData: User | null;
}

const StudySpotForm: React.FC<StudySpotFormProps> = ({
  schoolData,
  userData,
}) => {
  const router = useRouter();
  const [formPage, setFormPage] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [wifi, setWifi] = useState<boolean | undefined>(undefined);
  const [category, setCategory] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [storedRating, setStoredRating] = useState<number>(0);
  const [onCampus, setOnCampus] = useState<boolean | undefined>(undefined);
  const [hours, setHours] = useState<boolean | undefined>(undefined);
  const [restrooms, setRestrooms] = useState<boolean | undefined>(undefined);
  const [description, setDescription] = useState<string>('');
  const [resources, setResources] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [photoURLs, setPhotoURLs] = useState<string[]>([]);
  const [awsURLs, setAwsURLs] = useState<string[]>([]);

  const handleFileInput = () => {
    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.click();
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

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const handleOnCampusChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value == 'Yes' ? setOnCampus(true) : setOnCampus(false);
  };

  const handleWifiChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value == 'Yes' ? setWifi(true) : setWifi(false);
  };

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value == 'Yes' ? setHours(true) : setHours(false);
  };

  const handleRestroomsChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value == 'Yes' ? setRestrooms(true) : setRestrooms(false);
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    setStoredRating(rating);
  };

  const handleStarHover = (rating: number) => {
    setSelectedRating(rating);
  };
  const handleStarLeave = (rating: number) => {
    setSelectedRating(storedRating);
  };

  const handleResourcesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setResources((prevResources) => [...prevResources, value]);
    } else {
      setResources((prevResources) =>
        prevResources.filter((resource) => resource !== value)
      );
    }
  };

  //submit funcitonality
  useEffect(() => {
    const saveSpot = async () => {
      const studySpotData = {
        name,
        description,
        address,
        photos: awsURLs,
        wifi,
        rating: selectedRating,
        hour24: hours,
        category,
        onCampus,
        restrooms,
        resources,
        schoolId: schoolData?.id,
        userId: userData?.id,
      };
      console.log(studySpotData);

      try {
        const response = await fetch('/api/createStudySpot/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(studySpotData),
        });

        if (response.ok) {
          // Handle success
          console.log('Study spot created successfully');
        } else {
          // Handle failure
          console.error('Failed to create study spot');
        }
      } catch (error) {
        console.error('Error creating study spot:', error);
      }
    };
    if (awsURLs.length != 0) {
      saveSpot();
      router.push(`/school/${schoolData?.id}`);
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
        const uploadResponse = await fetch('/api/uploadPhotoSpot/', {
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
    <form className={styles.formPage} onSubmit={handleSubmit}>
      {/* FORM PAGE 1 */}
      {formPage === 1 && (
        <div className={styles.formPage1}>
          {formError && <p className={styles.formError}>{formError}</p>}
          <div className={styles.inputDiv}>
            <label htmlFor="name" className={styles.header}>
              Name
            </label>
            <p className={styles.desc}>
              Share the name or nickname of your study spot. (required)
            </p>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleNameChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="description" className={styles.header}>
              Description
            </label>
            <p className={styles.desc}>
              Share a brief description of your study spot. (required)
            </p>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              name="description"
              required
              className={styles.textArea}
            />
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="address" className={styles.header}>
              Address
            </label>
            <p className={styles.desc}>
              Share the address of your study spot. If you are unsure of the
              address you can enter the name or number of the building (e.g.
              Math and Science Building, {schoolData?.name}). (required)
            </p>
            <input
              type="text"
              name="address"
              value={address}
              onChange={handleAddressChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputDiv}>
            <p className={styles.header}>Photos</p>
            <p className={styles.desc}>
              Share some photos of your study spot. The photos could be of the
              working spaces, key features, the building, or whatever helps the
              most.
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
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.next}
              onClick={() => {
                if (!name || !description || !address) {
                  setFormError('Please fill out all of the required fields');
                  window.scrollTo(0, 400);
                  return;
                } else {
                  setFormError(null);
                  setFormPage(2);
                  window.scrollTo(0, 0);
                }
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* FORM PAGE 2 */}
      {formPage === 2 && (
        <div className={styles.formPage2}>
          {formError && <p className={styles.formError}>{formError}</p>}
          <div className={styles.inputDiv}>
            <label htmlFor="resources" className={styles.header}>
              Rating
            </label>
            <p className={styles.desc}>
              Provide a rating for your study spot. (required)
            </p>
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
          <div className={styles.inputDiv}>
            <label htmlFor="restrooms" className={styles.header}>
              Category
            </label>
            <p className={styles.desc}>
              What type of study spot is this? (required)
            </p>
            <fieldset className={styles.multipleChoice} name="category">
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="category"
                  value="cafe"
                  checked={category === 'cafe'}
                  onChange={handleCategoryChange}
                  required
                />
                Cafe
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="category"
                  value="library"
                  checked={category === 'library'}
                  onChange={handleCategoryChange}
                />
                Library
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="category"
                  value="public space"
                  checked={category === 'public space'}
                  onChange={handleCategoryChange}
                />
                Public Space
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="category"
                  value="work area"
                  checked={category === 'work area'}
                  onChange={handleCategoryChange}
                />
                Work Area
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="category"
                  value="other"
                  checked={category === 'other'}
                  onChange={handleCategoryChange}
                />
                Other
              </label>
            </fieldset>
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="onCampus" className={styles.header}>
              On Campus
            </label>
            <p className={styles.desc}>
              Is your study spot located on campus? (required)
            </p>
            <fieldset className={styles.multipleChoice} name="onCampus">
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="onCampus"
                  value="Yes"
                  checked={onCampus === true}
                  onChange={handleOnCampusChange}
                  required
                />
                Yes
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="onCampus"
                  value="No"
                  checked={onCampus === false}
                  onChange={handleOnCampusChange}
                />
                No
              </label>
            </fieldset>
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="wifi" className={styles.header}>
              Free Wifi
            </label>
            <p className={styles.desc}>
              Is there free wifi at your study spot? (required)
            </p>
            <fieldset className={styles.multipleChoice} name="wifi">
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="free wifi"
                  value="Yes"
                  checked={wifi === true}
                  onChange={handleWifiChange}
                  required
                />
                Yes
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="free wifi"
                  value="No"
                  checked={wifi === false}
                  onChange={handleWifiChange}
                />
                No
              </label>
            </fieldset>
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="wifi" className={styles.header}>
              Open 24 Hours
            </label>
            <p className={styles.desc}>
              Is your study spot open 24 hours a day? (required)
            </p>
            <fieldset className={styles.multipleChoice} name="hour24">
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="hour24"
                  value="Yes"
                  checked={hours === true}
                  onChange={handleHoursChange}
                  required
                />
                Yes
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="hour24"
                  value="No"
                  checked={hours === false}
                  onChange={handleHoursChange}
                />
                No
              </label>
            </fieldset>
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="restrooms" className={styles.header}>
              Public Restrooms
            </label>
            <p className={styles.desc}>
              Are there usable restrooms at your studyspot? (required)
            </p>
            <fieldset className={styles.multipleChoice} name="public restrooms">
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="restrooms"
                  value="Yes"
                  checked={restrooms === true}
                  onChange={handleRestroomsChange}
                  required
                />
                Yes
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="radio"
                  name="restrooms"
                  value="No"
                  checked={restrooms === false}
                  onChange={handleRestroomsChange}
                />
                No
              </label>
            </fieldset>
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="resources" className={styles.header}>
              Study Resources
            </label>
            <p className={styles.desc}>
              What resources does your study spot provide?
            </p>
            <fieldset className={styles.multipleChoice} name="study resources">
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="checkbox"
                  name="resources"
                  value="Printer"
                  onChange={handleResourcesChange}
                  required
                  checked={resources.includes('Printer')}
                />
                Printer
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="checkbox"
                  name="resources"
                  value="Whiteboard"
                  onChange={handleResourcesChange}
                  checked={resources.includes('Whiteboard')}
                />
                Whiteboard
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="checkbox"
                  name="resources"
                  value="Group Study Rooms"
                  onChange={handleResourcesChange}
                  checked={resources.includes('Group Study Rooms')}
                />
                Group Study Rooms
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="checkbox"
                  name="resources"
                  value="Charging Stations"
                  onChange={handleResourcesChange}
                  checked={resources.includes('Charging Stations')}
                />
                Charging Stations
              </label>
              <label className={styles.optionLabel}>
                <input
                  className={styles.option}
                  type="checkbox"
                  name="resources"
                  value="Computer Workstations"
                  onChange={handleResourcesChange}
                  checked={resources.includes('Computer Workstations')}
                />
                Computer Workstations
              </label>
            </fieldset>
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.previous}
              onClick={() => {
                setFormPage(1);
                window.scrollTo(0, 0);
              }}
            >
              Back
            </button>
            <button
              type="button"
              className={styles.next}
              onClick={() => {
                console.log(
                  wifi,
                  restrooms,
                  selectedRating,
                  category,
                  onCampus,
                  hours,
                  resources
                );
                if (
                  wifi == undefined ||
                  restrooms == undefined ||
                  selectedRating == 0 ||
                  category == '' ||
                  onCampus == undefined ||
                  hours == undefined
                ) {
                  setFormError('Please fill out all of the required fields');
                  window.scrollTo(0, 400);
                  return;
                } else {
                  setFormError(null);
                  setFormPage(3);
                  window.scrollTo(0, 0);
                }
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* FORM PAGE 3 */}
      {formPage === 3 && (
        <div className={styles.formPage3}>
          <p className={styles.review}>
            Confirm the information for your new study spot{' '}
            <span className={styles.header}>{name}</span>
          </p>
          <div className={styles.preview}>
            <div className={styles.left}>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Description</p>
                <p className={styles.inputPreview}>{description}</p>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Address </p>
                <p className={styles.inputPreview}>{address}</p>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Rating</p>
                <div className={styles.reviewStarsDiv}>
                  <ReviewStars rating={selectedRating ?? null} />
                </div>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Category</p>
                <p className={styles.inputPreview}>{category}</p>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Free Wifi</p>
                <p className={styles.inputPreview}>{wifi ? 'Yes' : 'No'}</p>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Open 24 hours</p>
                <p className={styles.inputPreview}>{hours ? 'Yes' : 'No'}</p>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Public Restrooms</p>
                <p className={styles.inputPreview}>
                  {restrooms ? 'Yes' : 'No'}
                </p>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Study Resources</p>
                <p className={styles.inputPreview}>
                  {resources.map((resource) => {
                    return (
                      <p className={styles.inputPreviewList} key={resource}>
                        {resource} <br />
                      </p>
                    );
                  })}
                </p>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Photos</p>
                {photos.length != 0 && (
                  <div className={styles.photos2}>
                    {photoURLs.map((url, index) => (
                      <div
                        key={`photo-${url}`}
                        className={styles.photoPreview2}
                      >
                        <Image
                          src={url}
                          alt={`Photo ${index + 1}`}
                          className={styles.uploadedPhotoPreview2}
                          width={150}
                          height={300}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className={styles.screened}>
            All Study Spots are screened for approval before being displayed.
          </p>
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.previous}
              onClick={() => {
                setFormPage(2);
                window.scrollTo(0, 0);
              }}
            >
              Back
            </button>
            <button type="submit" className={styles.next}>
              Submit
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default StudySpotForm;
