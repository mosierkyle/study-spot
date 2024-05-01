'use client';
import { Review, Save, StudySpot, User } from '@prisma/client';
import styles from './page.module.css';
import React, {
  useRef,
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import user2 from '../../public/user2.png';
import ReviewCard from '../components/review/review';
import Loading from './loading';
import SpotCard from '../components/spotCard/spotCard';
import upload from '../../public/upload5.png';
import x from '../../public/x.png';
import profilePic from '../../public/profilePic.png';
import account from '../../public/account3.png';
import save from '../../public/save3.png';
import star from '../../public/darkStar2.png';

interface Props {
  params: {
    school: string;
  };
}

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<'Reviews' | 'Saved Spots' | 'Edit Profile'>(
    'Edit Profile'
  );
  const [reviewData, setReviewData] = useState<Review[]>([]);
  const [savesData, setSavesData] = useState<StudySpot[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoURLs, setPhotoURLs] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [awsURLs, setAwsURLs] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getUser/', {
          method: 'GET',
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedUser = await responseData.user;
          setUser(parsedUser);
          setName(parsedUser?.name);
          setEmail(parsedUser?.email);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePage = (newPage: 'Reviews' | 'Saved Spots' | 'Edit Profile') => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/userReviews/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user?.id),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.reviews;
          setReviewData(parsedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/userSaves/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user?.id),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.saves;
          setSavesData(parsedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const saveProfile = async () => {
      let userData = {};
      if (awsURLs[0] === 'empty') {
        userData = {
          id: user?.id,
          name: name,
          email: email,
          avatar: user?.avatar ? user.avatar : null,
        };
      } else {
        userData = {
          id: user?.id,
          name: name,
          email: email,
          avatar: awsURLs[0],
        };
      }
      // console.log(userData);
      try {
        const response = await fetch('/api/editProfile/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          // router.refresh();
          window.location.reload();
        } else {
          console.error('Failed to update Profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
      setPage('Edit Profile');
    };
    if (awsURLs.length != 0) {
      saveProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awsURLs]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFileInput = () => {
    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handlePhotosChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (photos.length == 1) {
      setFormError('Photo limit exceeded: 1 photo max');
      window.scrollTo(0, 400);
      return;
    }
    const files = e.target.files;

    if (files) {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length + photos.length > 2) {
        setFormError('Photo limit exceeded: 1 photos max');
        window.scrollTo(0, 400);
        return;
      }
      setPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPhotoURLs((prevURLs) => [...prevURLs, ...urls]);
    }
  };

  const removePhoto = () => {
    setPhotos([]);
    setPhotoURLs([]);

    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await savePhoto();
  };

  const savePhoto = async () => {
    const urls: string[] = [];
    if (!photos[0]) {
      setAwsURLs(['empty']);
      return;
    }
    const file = photos[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const uploadResponse = await fetch('/api/uploadPhotoAvatar/', {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const { fileURL } = await uploadResponse.json();
        urls.push(fileURL);

        //Delete photo storage from s3 bucket after new one is uploaded
        try {
          const prevPhoto = user?.avatar;
          const deleteResponse = await fetch('/api/deletePhotoAvatar/', {
            method: 'POST',
            body: JSON.stringify(prevPhoto),
          });

          if (deleteResponse.ok) {
            const { repsonse } = await deleteResponse.json();
            console.log(repsonse);
            console.log(urls);
            setAwsURLs(urls);
          } else {
            console.error(`Failed to delete previous photo`);
            console.log(deleteResponse);
          }
        } catch (error) {
          console.error(`Error uploading photo`, error);
        }
      } else {
        console.error(`Failed to get photo URLs`);
      }
    } catch (error) {
      console.error(`Error uploading photo`, error);
    }
  };

  return (
    <main className={styles.mainStyle}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.userCard}>
            <Image
              className={styles.userPhoto}
              src={user?.avatar ? user.avatar : user2}
              alt="Account Avatar"
              width={120}
              height={120}
            />
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userSchool}>{user?.email ?? 'student'}</p>
            <div className={styles.options}>
              <div
                className={styles.option}
                onClick={() => handlePage('Edit Profile')}
              >
                <div className={styles.profileSVG}>
                  <Image
                    height={25}
                    width={25}
                    src={account}
                    alt="option"
                  ></Image>
                </div>
                <p className={styles.optionText}>Edit Profile</p>
              </div>
              <div
                className={styles.option}
                onClick={() => handlePage('Saved Spots')}
              >
                <div className={styles.profileSVG}>
                  <Image height={25} width={25} src={save} alt="option"></Image>
                </div>

                <p className={styles.optionText}>Saved Spots</p>
              </div>
              <div
                className={styles.option}
                onClick={() => handlePage('Reviews')}
              >
                <div className={styles.profileSVG}>
                  <Image height={25} width={25} src={star} alt="option"></Image>
                </div>
                <p className={styles.optionText}>Reviews</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <p className={styles.rightHeader}>{page}</p>
          {page === 'Reviews' && (
            <div className={styles.reviewsPage}>
              <div className={styles.reviews}>
                {reviewData ? (
                  reviewData.map((review) => {
                    return <ReviewCard key={review.id} reviewData={review} />;
                  })
                ) : (
                  <Loading></Loading>
                )}
              </div>
            </div>
          )}
          {page === 'Edit Profile' && (
            <div className={styles.editPage}>
              <form className={styles.form} onSubmit={handleSubmit}>
                {formError && <p className={styles.formError}>{formError}</p>}
                <div className={styles.inputDiv}>
                  <label htmlFor="hours" className={styles.header}>
                    Your Profile Photo
                  </label>
                  <p className={styles.desc}>Add / Edit your profile photo.</p>
                  {photoURLs.length != 0 && (
                    <div onClick={removePhoto} className={styles.removePhoto}>
                      <Image src={x} alt="x" height={20} width={20} />
                    </div>
                  )}
                  <label
                    onClick={handleFileInput}
                    htmlFor="photos"
                    className={styles.fileLabel}
                  >
                    <Image
                      src={
                        photoURLs.length != 0
                          ? photoURLs[0]
                          : user?.avatar
                          ? user.avatar
                          : profilePic
                      }
                      alt=""
                      height={100}
                      width={100}
                      className={styles.profilePhoto}
                    />
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
                  <label htmlFor="name" className={styles.header}>
                    Name
                  </label>
                  <p className={styles.desc}>
                    Your full name. Only your last initial will be displayed to
                    others. (required)
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
                  <label htmlFor="email" className={styles.header}>
                    Email
                  </label>
                  <p className={styles.desc}>Your email address. (required)</p>
                  <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.buttons}>
                  <button type="submit" className={styles.submit}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
          {page === 'Saved Spots' && (
            <div className={styles.spotsPage}>
              {savesData.map((spot) => (
                <SpotCard key={spot.id} spotData={spot} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Account;
