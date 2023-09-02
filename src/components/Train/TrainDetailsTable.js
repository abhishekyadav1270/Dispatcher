import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

//Other
import { } from "../../modules/actions";
import { Title } from "../commom/Title";
import TrainDetailsRow from "./TrainDetailsRow";

const TrainDetailsTable = ({ trainDetails }) => {
  const [filtered, setFiltered] = useState();
  const [lastfiltered, setLastFiltered] = useState();
  const [isSearch, setSearched] = useState(false);

  useEffect(() => {
    if (!isSearch) {
      setFiltered(trainDetails);
      setLastFiltered(trainDetails);
    }
  }, [trainDetails])
  //functions

  const searchTrain = (searchTrain) => {
    let filterTrain;
    const search = searchTrain.toLowerCase();
    if (search) {
      filterTrain = lastfiltered.filter(train =>
        (train.trainID && train.trainID.toLowerCase().includes(search)) ||
        (train.PTID && train.PTID.toString().toLowerCase().includes(search)) ||
        (train.radioID && train.radioID.toString().toLowerCase().includes(search)) ||
        (train.rakeId && train.rakeId.toLowerCase().includes(search))
      )
      setFiltered(filterTrain);
      setSearched(true);
    }
    else {
      setFiltered(lastfiltered);
      setSearched(false);
    }
  }

  return (
    <div>
      <Title title="Train Details" type="TD" search={searchTrain} />
      <div className={global.config.project != 'dhaka' ? "train-row-grid-head" : "trainT-row-grid-head"}>
        {global.config.project != 'dhaka' ?
          (<div class="tr-tb-cb">
            <input type="checkbox" />
          </div>) : null
        }
        <div class="tr-tb-tid">
          <span>Train ID</span>
        </div>
        <div class="tr-tb-pt-id mrg-0">
          <span>Rake ID</span>
        </div>
        <div class="tr-tb-r-id">
          <span>Radio ID</span>
        </div>
        {global.config.project != 'dhaka' ?
          (<div class="tr-tb-group">
            <span>Group</span>
          </div>) : null
        }
        <div class="tr-tb-act-cab">
          <span>Cab Status</span>
        </div>
        <div class="tr-tb-ops">
          <span>Mode</span>
        </div>
        <div class="tr-tb-line">
          <span>Line</span>
        </div>
        {global.config.project != 'dhaka' ?
          (<div class="tr-tb-aoc">
            <span>AOC</span>
          </div>) : null
        }
        <div class="tr-tb-dir">
          <span>Dirc.</span>
        </div>
        <div class="tr-tb-c-id">
          <span>Cab No.</span>
        </div>
      </div>
      <div style={{ height: "390px", overflowY: "scroll" }}>
        {filtered &&
          filtered.map((data) => {
            return (
              <TrainDetailsRow
                trainid={data.trainID}
                radioid={data.radioID ? data.radioID : "- -"}
                ptid={data.PTID ? data.PTID : "- -"}
                group={data.group ? data.group : "- -"}
                cabin={data.activeCabin ? data.activeCabin : "- -"}
                aoc={data.aoc ? data.aoc : "- -"}
                mode={data.mode ? data.mode : "- -"}
                line={data.line}
                dirc={data.dirn ? data.dirn : "- -"}
                crewid={data.crewid ? data.crewid : "- -"}
                rakeId={data.rakeId ? data.rakeId : "- -"}
              />
            );
          })}
        {filtered && filtered.length === 0 ? (
          <div
            class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
            style={{
              height: "445px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isSearch ? "No match found" : "No trains available"}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = ({ train }) => {
  const { trainDetails } = train;
  return {
    trainDetails,
  };
};

export default connect(mapStateToProps, {})(TrainDetailsTable);
