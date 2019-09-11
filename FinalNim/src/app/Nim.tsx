import React from "react"
import { Stack } from "./Stack";
import { IStone } from "./IStone";

interface IProps {
    stackLengths: number[];
}

interface IState {
    gameOver: boolean;
    Player: number;
    stacks: IStone[][];
}

export class Nim extends React.Component<IProps, IState> {
    stackChanged: number = -1;
    constructor(props: IProps) {
        super(props);
        this.state = { gameOver: false, Player: 0, stacks: [] };
        let stoneCount = 0;
        for (let i = 0; i < props.stackLengths.length; i++) {
            this.state.stacks.push([]);
            for (let j = 0; j < props.stackLengths[i]; j++) {
                this.state.stacks[i].push({ key: stoneCount, selected: false, onClick: () =>{ this.setState({ gameOver: false, Player: this.state.Player, stacks: this.flipButtonAt(i, j) }); this.setOnlyOneRow(); } })
                stoneCount++;
            }
        }
    }

    resetNim(): IState{
        let newGame: IState = { gameOver: false, Player: 0, stacks: [] };
        let stoneCount = 0;
        for (let i = 0; i < this.props.stackLengths.length; i++) {
            newGame.stacks.push([]);
            for (let j = 0; j < this.props.stackLengths[i]; j++) {
                newGame.stacks[i].push({ key: stoneCount, selected: false, onClick: () =>{ this.setState({ gameOver: false, Player: this.state.Player, stacks: this.flipButtonAt(i, j) }); this.setOnlyOneRow(); } });
                stoneCount++;
            }
        }
        return newGame;
    }

    flipButtonAt(stack: number, stone: number): IStone[][] {
        this.stackChanged = stack;
        let newStones: IStone[][] = [...this.state.stacks];

        // debugger
        newStones[stack][stone] = { key: this.state.stacks[stack][stone].key, selected: !this.state.stacks[stack][stone].selected, onClick: () =>{ this.setState({ gameOver: false, Player: this.state.Player, stacks: this.flipButtonAt(stack, stone) }); this.setOnlyOneRow(); } }

        return newStones;
    }

    setOnlyOneRow(){
        for(let stack = 0; stack < this.state.stacks.length; stack++){
            if (!this.allFree(this.state.stacks[stack]) && stack != this.stackChanged) {
                console.log("restructure stack")
                this.setState({ stacks: this.resetStack(stack) })
            }
        }
    }

    resetStack(stack: number): IStone[][] {
        let newStones = [...this.state.stacks];

        newStones[stack] = newStones[stack].map((stone) => { return { key: stone.key, selected: false, onClick: stone.onClick } })

        return newStones;
    }

    allFree(stack: IStone[]): boolean {
        for (let i = 0; i < stack.length; i++) {
            if (stack[i].selected) {
                return false;
            }
        }
        return true;
    }

    removeAllSelected(): IStone[][] {
        let newStones: IStone[][] = [...this.state.stacks];

        for (let stack = 0; stack < this.state.stacks.length; stack++) {
            newStones.push([]);
            for (let stone = 0; stone < this.state.stacks[stack].length; stone++) {

                if(newStones[stack][stone].selected){
                    newStones[stack].splice(stone, 1);
                    stone = stone - 1;
                }
            }
        }
        for(let stack = 0; stack < newStones.length; stack++){
            for(let stone = 0; stone < newStones[stack].length; stone++){
                newStones[stack][stone] = { key: newStones[stack][stone].key, selected: false, onClick: () =>{ this.setState({ Player: this.state.Player, stacks: this.flipButtonAt(stack, stone) }); this.setOnlyOneRow(); } };
            }
        }

        return newStones;
    }

    changePlayer(){
        return (this.state.Player + 1) % 2
    }

    gameOver(stacks: IStone[][]): boolean{
        for(let stack = 0; stack < stacks.length; stack++)
        {
            if(stacks[stack].length > 0)
                return false;
        }
        return true;
    }

    handleSubmit(){
        const newStacks = this.removeAllSelected();
        const isGameOver = this.gameOver(newStacks);

        this.setState({
            stacks: newStacks,
            gameOver: isGameOver,
            Player: this.changePlayer()
        })
    }

    render() {

        if(this.state.gameOver){
            return(
                <div>
                    Player {this.state.Player} has won!
                    <br/>
                    <button onClick={ () => { 
                        this.setState(this.resetNim());
                    }}>Play Again?</button>
                </div>
            )
        }
        else{
            return (
                <div>
                    <div>
                        Player: {this.state.Player}
                    </div>
                    <div>
                        {this.state.stacks.map((stack, index) => {
                            if (stack.length > 0) {
                                return <Stack key={index} stones={stack} />
                            }
                            else {
                                return null;
                            }
                        })}
                    </div>
                    <br />
                    <div>
                        <button onClick={ () => this.handleSubmit() }>submit</button>
                    </div>
                </div>
            )
        }
    }
}