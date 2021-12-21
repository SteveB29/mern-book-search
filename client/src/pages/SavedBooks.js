import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // set up GET_ME query to use
  const { loading, data: userData } = useQuery(GET_ME);

  // set saved books local to GET_ME savedBooks or empty array if does not exist
  const savedBooksLocal = userData?.me.savedBooks || [];

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {

    try {
      // removes the book from savedBooks array
      const { data } = await removeBook({
        variables: { bookId },
        // updates the GET_ME cache to remove book without having to refetch the query
        update: cache => {
          const { me } = cache.readQuery({ query: GET_ME });
          let newData = me.savedBooks;
          newData = newData.filter(book => book.bookId !== bookId);
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...me, savedBooks: newData}}
          });
        }
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.me.bookCount
            ? `Viewing ${userData.me.username} saved ${userData.me.bookCount === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {savedBooksLocal.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
