'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import upload from '../../../public/upload3.png';
import x from '../../../public/x2.png';
import { School } from '@prisma/client';

interface StudySpotFormProps {
  schoolData: School | null;
}

const StudySpotForm: React.FC<StudySpotFormProps> = ({ schoolData }) => {
  const [formPage, setFormPage] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [wifi, setWifi] = useState<string>('');
  const [noiseLevel, setNoiseLevel] = useState<string>('');
  const [seating, setSeating] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [restrooms, setRestrooms] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [resources, setResources] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [photoURLs, setPhotoURLs] = useState<string[]>([]);

  const handleFileInput = () => {
    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handlePhotosChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(files);
    if (files) {
      const selectedFiles = Array.from(files);
      setPhotos(selectedFiles);
      console.log(selectedFiles);
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPhotoURLs(urls);
      console.log(urls);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    const updatedPhotos = photos.filter((_, index) => index !== indexToRemove);
    const updatedPhotoURLs = photoURLs.filter(
      (_, index) => index !== indexToRemove
    );

    setPhotos(updatedPhotos);
    setPhotoURLs(updatedPhotoURLs);
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

  const handleWifiChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWifi(e.target.value);
  };

  const handleNoiseLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNoiseLevel(e.target.value);
  };

  const handleSeatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSeating(e.target.value);
  };

  const handleHoursChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setHours(e.target.value);
  };

  const handleRestroomsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRestrooms(e.target.value);
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Submit logic here
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
                <div className={styles.photoPreview}>
                  {photoURLs.map((url, index) => (
                    <>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className={styles.removePhoto}
                      >
                        <Image src={x} alt="x" height={20} width={20} />
                      </button>
                      <Image
                        key={`${url}${index}`}
                        src={url}
                        alt={`Photo ${index + 1}`}
                        className={styles.uploadedPhotoPreview}
                        width={150}
                        height={300}
                      />
                    </>
                  ))}
                </div>
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
                  checked={wifi === 'Yes'}
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
                  checked={wifi === 'No'}
                  onChange={handleWifiChange}
                />
                No
              </label>
            </fieldset>
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="noise level" className={styles.header}>
              Noise Level
            </label>
            <p className={styles.desc}>
              Share how the noise level is at your study spot. (required)
            </p>
            <input
              type="text"
              name="noise level"
              required
              className={styles.input}
              value={noiseLevel}
              onChange={handleNoiseLevelChange}
            />
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="seating" className={styles.header}>
              Seating Capacity
            </label>
            <p className={styles.desc}>
              Share how much seating there is at your study spot. (required)
            </p>
            <input
              type="text"
              name="seating"
              required
              className={styles.input}
              value={seating}
              onChange={handleSeatingChange}
            />
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="hours" className={styles.header}>
              Hours
            </label>
            <p className={styles.desc}>
              What are the hours like at your study spot.
            </p>
            <textarea
              value={hours}
              onChange={handleHoursChange}
              name="hours"
              required
              className={styles.textArea}
            />
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
                  checked={restrooms === 'Yes'}
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
                  checked={restrooms === 'No'}
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
                if (!wifi || !noiseLevel || !seating || !restrooms) {
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
                <p className={styles.inputPreviewName}>Free Wifi</p>
                <p className={styles.inputPreview}>{wifi}</p>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Noise Level</p>
                <p className={styles.inputPreview}>{noiseLevel}</p>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Seating Capacity</p>
                <p className={styles.inputPreview}>{seating}</p>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Hours</p>
                <p className={styles.inputPreview}>{hours}</p>
              </div>
              <div className={styles.inputPreviewDiv}>
                <p className={styles.inputPreviewName}>Public Restrooms</p>
                <p className={styles.inputPreview}>{restrooms}</p>
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
                <p className={styles.inputPreview}>{photoURLs}</p>
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
