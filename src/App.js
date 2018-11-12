import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import lodash from 'lodash';

import './App.css';
import { dfsSearch } from './algorithms/dfsSearch';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            matrixIndex: 0,
            depthLimit: 0,
            generateMatrixPressed: false,
            dfsPressed: false,
            submitMatrixPressed: false,
            inputsArray: [],
            matrixArray: [],
            resultsObject: [
                {
                    path: [],
                    numberOfIterations: 0,
                    searchPattern: []
                }
            ],
            destinations: []
        };
    }

    render() {
        const {
            generateMatrixPressed,
            inputsArray,
            resultsObject,
            matrixIndex,
            dfsPressed,
            destinations,
            submitMatrixPressed
        } = this.state;

        return (
            <Container>
                <DataContainer>
                    <BlockDataContainer>
                        <label>Generate nxn matrix where n = </label>
                        <MatrixIndex
                            value={this.state.matrixIndex}
                            disabled={generateMatrixPressed}
                            onChange={event => this.onChangeMatrixIndex(event)}
                        />
                        <GenerateMatrix
                            variant="contained"
                            onClick={this.onGenerateMatrixHandler}
                            disabled={generateMatrixPressed}
                        >
                            Generate Matrix
                        </GenerateMatrix>
                    </BlockDataContainer>
                    <InfoContainer>
                        {generateMatrixPressed && (
                            <Info>
                                Please enter initial position with X and
                                destinations with 1,2,3...
                            </Info>
                        )}
                    </InfoContainer>
                    <MatrixContainer>
                        {generateMatrixPressed &&
                            inputsArray.map((e, index) => {
                                return (
                                    <MatrixInput
                                        key={index}
                                        onChange={this.handleChange.bind(
                                            this,
                                            index
                                        )}
                                    />
                                );
                            })}
                    </MatrixContainer>
                    {generateMatrixPressed && matrixIndex > 0 && (
                        <SubmitMatrixContainer>
                            <SubmitMatrix
                                variant="contained"
                                type="submit"
                                disabled={submitMatrixPressed}
                                onClick={event =>
                                    this.onSaveMatrixHandler(event)
                                }
                            >
                                Submit Matrix
                            </SubmitMatrix>
                        </SubmitMatrixContainer>
                    )}
                    <SearchButtonContainer>
                        <SearchButton
                            variant="contained"
                            disabled={dfsPressed}
                            onClick={this.onDFSButtonHandler}
                        >
                            Depth First Search
                        </SearchButton>
                    </SearchButtonContainer>
                </DataContainer>
                <ResultsContainer>
                    {dfsPressed &&
                        resultsObject.map((e, index) => {
                            return (
                                <SearchPatternContainer key={index}>
                                    <OriginalMatrix>
                                        {inputsArray.map(e => {
                                            return (
                                                <label key={index}>
                                                    {` ${e.value} `}
                                                </label>
                                            );
                                        })}
                                    </OriginalMatrix>
                                    <SearchPattern>
                                        {e.searchPattern}
                                    </SearchPattern>
                                </SearchPatternContainer>
                            );
                        })}
                    <PathContainer>
                        {/* {dfsPressed &&
                            destinations.map((e, index) => (
                                <Path key={index}>
                                    Path to destination {e}:{' '}
                                    {resultsObject[0].path.join(', ')}
                                </Path>
                            ))} */}
                    </PathContainer>
                    <Iterations>
                        {dfsPressed &&
                            resultsObject.map((e, index) => {
                                return (
                                    <label key={index}>
                                        Number of iterations:{' '}
                                        {e.numberOfIterations}
                                        <br />
                                    </label>
                                );
                            })}
                    </Iterations>
                </ResultsContainer>
            </Container>
        );
    }

    onChangeMatrixIndex = event => {
        this.setState({ matrixIndex: event.target.value });
    };

    onChangeDepthLimit = event => {
        this.setState({ depthLimit: event.target.value });
    };

    onGenerateMatrixHandler = () => {
        const { inputsArray, matrixIndex } = this.state;
        const arrayOfInputs = inputsArray;

        for (let i = 1; i <= matrixIndex * matrixIndex; ++i) {
            arrayOfInputs.push({
                index: i,
                value: ''
            });
        }

        this.setState({
            generateMatrixPressed: true,
            inputsArray: arrayOfInputs
        });
    };

    onDepthSearchLimitedSearch = () => {
        this.setState({ dfsPressed: true });
    };

    handleChange(index, event) {
        let inputsArray = this.state.inputsArray;
        inputsArray[index].value = event.target.value;
        this.setState({ inputsArray });
    }

    onSaveMatrixHandler = () => {
        const { inputsArray, matrixIndex } = this.state;
        const matrix = [];
        const destinationsArray = [];
        const chunkedInputsArray = lodash.chunk(inputsArray, matrixIndex);

        for (let i = 0; i < matrixIndex; ++i) {
            matrix[i] = [];
            for (let j = 0; j < matrixIndex; ++j) {
                matrix[i][j] = [];
            }
        }

        for (let i = 0; i < matrixIndex; ++i) {
            for (let j = 0; j < matrixIndex; ++j) {
                matrix[i][j] = chunkedInputsArray[i][j].value;
            }
        }

        for (let i = 0; i < matrixIndex; ++i) {
            for (let j = 0; j < matrixIndex; ++j) {
                if (!isNaN(matrix[i][j])) {
                    destinationsArray.push(matrix[i][j]);
                }
            }
        }

        this.setState(
            {
                matrixArray: matrix,
                destinations: destinationsArray,
                submitMatrixPressed: true
            },
            () => {
                this.onSetStateAsyncHandler(
                    this.state.matrixArray,
                    this.state.destinations
                );
            }
        );
    };

    onSetStateAsyncHandler = (matrix, destinations) => {
        this.setState({ matrixArray: matrix, destinations: destinations });
    };

    onDFSButtonHandler = async () => {
        const { matrixArray, destinations } = this.state;
        let resultObject = [];
        let resultObjects = [];

        for (let i = 0; i < destinations.length; ++i) {
            if (i === 0) {
                resultObject = await dfsSearch(
                    matrixArray,
                    'X',
                    destinations[i]
                );
                console.log('First Path');
                console.log(resultObject);
                resultObjects.push(resultObject);
                resultObject = [];
            } else if (i === destinations.length - 1) {
                resultObject = await dfsSearch(
                    matrixArray,
                    destinations[i],
                    'X'
                );
                console.log('Last Path');
                console.log(resultObject);
                resultObjects.push(resultObject);
                resultObject = [];
            } else {
                resultObject = await dfsSearch(
                    matrixArray,
                    destinations[i],
                    destinations[i + 1]
                );
                console.log('Middle Path');
                console.log(resultObject);
                resultObjects.push(resultObject);
                resultObject = [];
            }
        }

        this.setState({ resultsObject: resultObjects, dfsPressed: true });

        // console.log(paths);

        // this.setState({ resultsObject: resultObject, dfsPressed: true }, () => {
        //     console.log(this.state.resultsObject);
        // });
    };
}

export default App;

const Container = styled.div`
    display: flex;
`;

const DataContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 50%;
    padding: 10%;
`;

const BlockDataContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 5%;
`;

const MatrixIndex = styled.input`
    margin: 0 2rem 0 0.5rem;
    height: 3rem;
    width: 2rem;
    text-align: center;
`;

const GenerateMatrix = styled(Button)`
    && {
        font-size: 1.2rem;
    }
`;

const InfoContainer = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 5%;
`;

const Info = styled.p`
    font-size: 1.4rem;
    text-align: center;
`;

const MatrixContainer = styled.div`
    display: flex;
    /* flex-direction: column; */
    justify-content: center;
`;

const MatrixInput = styled.input`
    margin: 0 0.5rem;
    width: 2rem;
    height: 2rem;
    text-align: center;
`;

const SubmitMatrixContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const SubmitMatrix = styled(Button)`
    && {
        width: 13rem;
        height: 3.6rem;
        margin-top: 5rem;
        font-size: 1.2rem;
    }
`;

const SearchButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 50%;
`;

const SearchButton = styled(Button)`
    && {
        width: 25rem;
        height: 3.6rem;
        font-size: 1.2rem;
    }
`;

const ResultsContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-left: 2px solid gray;
    flex: 50%;
    align-items: center;
    justify-content: space-between;
    padding: 10%;
`;

const SearchPatternContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
`;

const OriginalMatrix = styled.p`
    text-align: center;
    border-left: 1px solid black;
    border-right: 1px solid black;
    margin-right: 10%;
`;

const SearchPattern = styled.p`
    text-align: center;
    border-left: 1px solid black;
    border-right: 1px solid black;
`;

const PathContainer = styled.div``;

const Path = styled.p``;

const Iterations = styled.p``;
