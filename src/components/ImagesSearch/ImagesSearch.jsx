import { useEffect, useState } from 'react';

import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import Loader from '../Loader/Loader';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import { searchPosts } from '../../api/posts';

import styles from './images-search.module.css';

const ImagesSearch = () => {
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [postDetails, setPostDetails] = useState({});
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data } = await searchPosts(search, page);
        setPosts(prevPosts =>
          data?.hits?.length ? [...prevPosts, ...data.hits] : prevPosts
        );
        setTotalHits(data.totalHits);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (search) {
      fetchPosts();
    }
  }, [search, page]);

  const handleSearch = ({ search }) => {
    setSearch(search);
    setPosts([]);
    setPage(1);
  };

  const loadMore = () => setPage(prevPage => prevPage + 1);

  const showModal = ({ largeImageURL }) => {
    setModalOpen(true);
    setPostDetails({
      largeImageURL,
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setPostDetails({});
  };

  const isPosts = Boolean(posts.length);

  return (
    <>
      <Searchbar onSubmit={handleSearch} />
      {error && <p className={styles.error}>{error}</p>}
      {loading && <Loader />}
      {isPosts && <ImageGallery showModal={showModal} items={posts} />}

      {isPosts && (
        <div className={styles.loadMoreWrapper}>
          {posts.length < totalHits && (
            <Button onClick={loadMore} type="button">
              Load more
            </Button>
          )}
        </div>
      )}

      {modalOpen && (
        <Modal close={closeModal}>
          <img
            className={styles.image}
            src={postDetails.largeImageURL}
            alt="big view"
          />
        </Modal>
      )}
    </>
  );
};

export default ImagesSearch;
