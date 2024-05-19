import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getTv_latest, getTv_airing, getTv_popular, getTv_topRated, IGetTvResults, ITv } from "../api";
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
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
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

const Bigtv = styled(motion.div)`
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

const Before = styled(motion.div)`
    position:absolute;
    height:200px;
    background-color: transparent;
    width:30px;
    text-align:center;
    z-index:100;
    top:0;
    left:0;
    &:hover{
        background-color: rgba(0,0,0,0.7);
        cursor:pointer
    }
    &:hover span{
        color:${(props) => props.theme.white.lighter};
    }
`;

const After = styled(motion.div)`
    position:absolute;
    height:200px;
    background-color: transparent;
    width:30px;
    text-align:center;
    z-index:100;
    top:0;
    right:0;
    &:hover{
        background-color: rgba(0,0,0,0.7);
        cursor:pointer
    }
    &:hover span{
        color:${(props) => props.theme.white.lighter};
    }
`;

const Arrow = styled(motion.span)`
  line-height:200px;
  color:transparent;
`;

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string,type: string }>("/tv/:tvId/:type");
  const { scrollY } = useViewportScroll();
  
  const { data:data_tv1, isLoading:isLoading_tv1 } = useQuery<IGetTvResults>(
    ["tv", "airing"],
    getTv_airing
  );
  const { data:data_tv2, isLoading:isLoading_tv2 } = useQuery<ITv>(
    ["tv", "latest"],
    getTv_latest
  );

  const { data:data_tv3, isLoading:isLoading_tv3 } = useQuery<IGetTvResults>(
    ["tv", "popular"],
    getTv_popular
  );

  const { data:data_tv4, isLoading:isLoading_tv4 } = useQuery<IGetTvResults>(
    ["tv", "top"],
    getTv_topRated
  );
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [index3, setIndex3] = useState(0);
  const [index4, setIndex4] = useState(0);
  const [leaving1, setLeaving1] = useState(false);
  const [leaving2, setLeaving2] = useState(false);
  const [leaving3, setLeaving3] = useState(false);
  const [leaving4, setLeaving4] = useState(false);
  const nextIndex = (type:string) => {
    if (data_tv1&&type==="1") {
      if (leaving1) return;
      toggleLeaving("1");
      const totalTv = data_tv1.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setIndex1((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
    if (data_tv3&&type==="3") {
        if (leaving3) return;
        toggleLeaving("3");
        const totalTv = data_tv3.results.length - 1;
        const maxIndex = Math.floor(totalTv / offset) - 1;
        setIndex3((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
    if (data_tv4&&type==="4") {
        if (leaving4) return;
        toggleLeaving("4");
        const totalTv = data_tv4.results.length - 1;
        const maxIndex = Math.floor(totalTv / offset) - 1;
        setIndex4((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
      
  };
  const beforeIndex = (type:string) => {
    if (data_tv1&&type==="1") {
        if (leaving1) return;
        toggleLeaving("1");
        const totalTv = data_tv1.results.length - 1;
        const maxIndex = Math.floor(totalTv / offset) - 1;
        setIndex1((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
      if (data_tv3&&type==="3") {
          if (leaving3) return;
          toggleLeaving("3");
          const totalTv = data_tv3.results.length - 1;
          const maxIndex = Math.floor(totalTv / offset) - 1;
          setIndex3((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
      if (data_tv4&&type==="4") {
          if (leaving4) return;
          toggleLeaving("4");
          const totalTv = data_tv4.results.length - 1;
          const maxIndex = Math.floor(totalTv / offset) - 1;
          setIndex4((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
  };
  const toggleLeaving = (type:string) => {
    if(type==="1")
        setLeaving1((prev) => !prev);
    if(type==="2")
        setLeaving2((prev) => !prev);
    if(type==="3")
        setLeaving3((prev) => !prev);
    if(type==="4")
        setLeaving4((prev) => !prev);
  }
  const onBoxClicked = (tvId: number,type:string) => {
    history.push(`/tv/${tvId}/${type}`);
  };
  const onOverlayClick = () => history.push("/tv");
  const clickedTv =
  bigTvMatch?.params.tvId && (bigTvMatch?.params.type==="1"? 
    data_tv1?.results.find((tv) => tv.id === +bigTvMatch.params.tvId)
    :bigTvMatch?.params.type==="3"?data_tv3?.results.find((tv) => tv.id === +bigTvMatch.params.tvId)
    :bigTvMatch?.params.type==="4"?data_tv4?.results.find((tv) => tv.id === +bigTvMatch.params.tvId):data_tv2);

 
  return (
    <Wrapper>
      {isLoading_tv1 ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(data_tv1?.results[0].backdrop_path || "")}
          >
            <Title>{data_tv1?.results[0].name}</Title>
            <Overview>{data_tv1?.results[0].overview}</Overview>
          </Banner>
          <Label style={{top:-110}}>Latest Shows</Label>
          <Slider style={{top: -100}}>
            <AnimatePresence initial={false} onExitComplete={()=>toggleLeaving("1")}>
              <Before onClick={()=>{beforeIndex("1")}}><Arrow>&lt;</Arrow></Before>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index1}
              >
                {data_tv1?.results
                  .slice(1)
                  .slice(offset * index1, offset * index1 + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + "v1"}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id,"1")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <After onClick={()=>{nextIndex("1")}}><Arrow>&gt;</Arrow></After>
            </AnimatePresence>
          </Slider>
          <Label style={{top:100}}>Airing Today</Label>
          <Slider style={{top:110}}>
            <AnimatePresence initial={false} onExitComplete={()=>toggleLeaving("2")}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index2}
              >
                {data_tv2!==undefined &&(
                    <Box
                      layoutId={data_tv2.id + "v2"}
                      key={data_tv2.id+"v2"}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(data_tv2.id,"2")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(data_tv2.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{data_tv2.name}</h4>
                      </Info>
                    </Box>
                  )}
              </Row>
            </AnimatePresence>
          </Slider>
          <Label style={{top:310}}>Popular</Label>
          <Slider style={{top:320}}>
            <AnimatePresence initial={false} onExitComplete={()=>toggleLeaving("3")}>
              <Before onClick={()=>{beforeIndex("3")}}><Arrow>&lt;</Arrow></Before>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index3}
              >
                {data_tv3?.results
                  .slice(offset * index3, offset * index3 + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + "v3"}
                      key={tv.id+"v3"}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id,"3")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <After onClick={()=>{nextIndex("3")}}><Arrow>&gt;</Arrow></After>
            </AnimatePresence>
          </Slider>
          <Label style={{top:520}}>Top Rated</Label>
          <Slider style={{top:530}}>
            <AnimatePresence initial={false} onExitComplete={()=>toggleLeaving("4")}>
            <Before onClick={()=>{beforeIndex("4")}}><Arrow>&lt;</Arrow></Before>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index4}
              >
                {data_tv4?.results
                  .slice(offset * index4, offset * index4 + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + "v4"}
                      key={tv.id+"v4"}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id,"4")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <After onClick={()=>{nextIndex("4")}}><Arrow>&gt;</Arrow></After>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <Bigtv
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigTvMatch.params.tvId+"v"+bigTvMatch.params.type}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                    </>
                  )}
                </Bigtv>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;