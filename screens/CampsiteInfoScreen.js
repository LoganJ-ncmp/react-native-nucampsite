import { FlatList, StyleSheet, Text, View, Button, Modal } from "react-native";
import { Rating, Input } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import RenderCampsite from "../features/campsites/RenderCampsite";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import { postComment } from "../features/comments/commentsSlice";
import * as Animatable from "react-native-animatable";

const CampsiteInfoScreen = ({ route }) => {
  const { campsite } = route.params;
  const [showModal, setShowModal] = useState(false);
  const [showRating, setShowRating] = useState(5);
  const [showAuthor, setShowAuthor] = useState("");
  const [showText, setShowText] = useState("");
  const comments = useSelector((state) => state.comments);
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const newComment = {
      author: showAuthor,
      rating: showRating,
      text: showText,
      campsiteId: campsite.id,
    };
    dispatch(postComment(newComment));
    setShowModal(!showModal);
  };

  const resetForm = () => {
    setShowRating(5);
    setShowAuthor("");
    setShowText("");
  };

  const renderCommentItem = ({ item }) => {
    return (
      <View style={styles.commentItem}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <Rating
          startingValue={item.rating}
          imageSize={10}
          style={{ alignItems: "flex-start", paddingVertical: "5%" }}
          readonly
        />
        <Text style={{ fontSize: 12 }}>
          {`-- ${item.author}, ${item.date}`}
        </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <FlatList
        data={comments.commentsArray.filter(
          (comment) => comment.campsiteId === campsite.id
        )}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          marginHorizontal: 20,
          paddingVertical: 20,
        }}
        ListHeaderComponent={
          <>
            <RenderCampsite
              campsite={campsite}
              isFavorite={favorites.includes(campsite.id)}
              markFavorite={() => dispatch(toggleFavorite(campsite.id))}
              onShowModal={() => setShowModal(!showModal)}
            />
            <Text style={styles.commentsTitle}>Comments</Text>
          </>
        }
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <View style={styles.modal}>
          <Rating
            showRating
            startingValue={showRating}
            imageSize={40}
            onFinishRating={(rating) => setShowRating(rating)}
            style={{ paddingVertical: 10 }}
          />
          <Input
            placeholder="Author"
            leftIcon={{ type: "font-awesome", name: "user-o" }}
            leftIconContainerStyle={{ paddingRight: 10 }}
            onChangeText={(author) => setShowAuthor(author)}
            value={showAuthor}
          ></Input>
          <Input
            placeholder="Comment"
            leftIcon={{ type: "font-awesome", name: "comment-o" }}
            leftIconContainerStyle={{ paddingRight: 10 }}
            onChangeText={(text) => setShowText(text)}
            value={showText}
          ></Input>
          <View style={{ margin: 10 }}>
            <Button
              onPress={() => {
                handleSubmit();
                resetForm();
              }}
              color="#5637DD"
              title="Submit"
            />
          </View>
          <View style={{ margin: 10 }}>
            <Button
              onPress={() => {
                setShowModal(!showModal);
                resetForm();
              }}
              color="#808080"
              title="Cancel"
            />
          </View>
        </View>
      </Modal>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  commentsTitle: {
    textAlign: "center",
    backgroundColor: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    color: "#43484D",
    padding: 10,
    paddingTop: 30,
  },
  commentItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
});

export default CampsiteInfoScreen;
