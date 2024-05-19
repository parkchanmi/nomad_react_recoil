import { useLocation } from "react-router";

import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getMovies_playing, getMovies_latest, getMovies_topRated, getMovies_upComing, IGetMoviesResult, IMovie, IGetSearchResult, getSearch_result } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 15px;
  grid-row-gap: 40px;
  grid-template-columns: repeat(5, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:last-child {
    transform-origin: center right;
  }
  &:first-child {
    transform-origin: center left;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMedia = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

const Label = styled.p`
  position:relative;
  color: ${(props) => props.theme.white.lighter};
`;


function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);

  const history = useHistory();
  const bigSearchMatch = useRouteMatch<{ mediaId: string}>("/search/:mediaId");
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetSearchResult>(
    ["multi", "searchResult"],
    () => getSearch_result(keyword)
  );

  const [index, setIndex] = useState(0);
  
  const [leaving, setLeaving] = useState(false);
 
 
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  }
  const onBoxClicked = (mediaId: number) => {
    history.push(`/search/${mediaId}`);
  };
  const onOverlayClick = () => history.push("/search");
  const clickedMovie =
  bigSearchMatch?.params.mediaId && 
    data?.results.find((media) => media.id === +bigSearchMatch.params.mediaId);

 
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Label style={{top:100}}>검색어:{keyword} [검색결과:{data?.results
                  .filter((media) => ( media.backdrop_path!==null)).length}건]</Label>
          <Slider style={{top: 120}}>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row key={index}
              >
                {data?.results
                  .map((media) => ( media.backdrop_path!==null &&
                    <Box
                      layoutId={media.id+""}
                      key={media.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(media.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(media.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{media.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          
          <AnimatePresence>
            {bigSearchMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMedia
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigSearchMatch.params.mediaId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.name}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMedia>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;