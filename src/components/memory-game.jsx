import { useEffect, useState } from "react"

const MemoryGame = () => {
    const [gridSize, setGridSize] = useState(2)
    const [maxMove, setMaxMove] = useState(0)
    const [moveCount, setMoveCount] = useState(0)
    const [cards, setCards] = useState([])
    const [resolved, setResolved] = useState([])
    const [flipped, setFlipped] = useState([])
    const [won, setWon] = useState(false)

    const handleGridSizeChange = e => {
        setGridSize(e.target.value)
    }

    const handleMaxMoveChange = e => {
        setMaxMove(e.target.value)
    }

    useEffect(() => {
        initializeMemoryGame()
    }, [gridSize])

    const initializeMemoryGame = () => {
       const totalCards = gridSize * gridSize
       const pairs = Math.floor(totalCards/2)
       let numbers = [...Array(pairs).keys()].map(n => n+1)
       numbers = [...numbers, ...numbers]
       const cardsTemp = []
       numbers.forEach(num => {
        cardsTemp.push({
            id: Math.random(),
            value: num
        })
       })
       setCards(cardsTemp.sort(() => Math.random() - 0.5))
       setResolved([])
       setFlipped([])
       setMoveCount(0)
       setWon(false)
    }

    const isFlipped = id => flipped.includes(id)
    const isResolved = id => resolved.includes(id)
    const isMaxMovedReached = () => maxMove !== 0 && moveCount >= maxMove

    const handleClickCard = id => {
        if (!isFlipped(id) && !isResolved(id) && !isMaxMovedReached()) {
            setFlipped([...flipped, id])
            setMoveCount(moveCount+1)
        }
    }

    useEffect(() => {
        if (flipped.length === 2) {
            const currentFlip = cards.find(c => c.id === flipped[1])
            const prevFlip = cards.find(c => c.id === flipped[0])
            if (currentFlip.value === prevFlip.value) {
                setFlipped([])
                setResolved([...resolved, flipped[1], flipped[0]])
            } else {
                setTimeout(() => {
                    setFlipped([])
                }, 500)
            }
        }
    }, [flipped])

    useEffect(() => {
        resolved.length !== 0 && resolved.length === cards.length && setWon(true)
    }, [resolved])

    return  <div className="flex flex-col gap-4 items-center p-5">
        <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
        <div className="flex flex-row justify-around gap-3">
            <div className="flex gap-2">
                <label htmlFor="grid-size" className="self-center">Grid Size</label>
                <input id="grid-size" type="number" min="2" max="10" value={gridSize} onChange={handleGridSizeChange}
                    className="border-2 border-gray-300 rounded px-2 py-1"
                ></input>
            </div>
            <div className="flex gap-2">
                <label htmlFor="max-move" className="self-center">Max Moves(0 for unlimited)</label>
                <input id="max-move" type="number" value={maxMove} onChange={handleMaxMoveChange}
                    className="border-2 border-gray-300 rounded px-2 py-1"
                ></input>
            </div>
        </div>
        {
            maxMove && maxMove !== 0 &&
            <div className="text-xl">
                <span className="font-bold">Moves</span>: {moveCount}/{maxMove}
            </div>
        }
        
        <div className={`grid gap-2 m-4`}
            style={{
                gridTemplateColumns: `repeat(${gridSize}, minMax(0, 1fr))`,
                width: `min(100%, ${gridSize * 5.5}rem)`
            }}>
            {
                cards.map(card => {
                    return (
                        <div key={card.id} onClick={() => handleClickCard(card.id)} disabled={isFlipped(card.id) || isResolved(card.id)} className={`aspect-square flex items-center justify-center border-2 border-radius transition-all duration-300 font-bold rounded-lg text-xl ${isFlipped(card.id) ? 'bg-blue-500 text-white': (isResolved(card.id) ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-400 cursor-pointer')}`}>
                            {isFlipped(card.id) || isResolved(card.id) ? card.value : '?'}
                        </div>
                    )
                })
            }
        </div>
        {won && <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">You Won</div>}
        {isMaxMovedReached() && <div className="mt-4 text-4xl font-bold text-red-600 animate-bounce">Game Over</div>}
        {
            (resolved.length > 0 || isMaxMovedReached()) &&
            <button
                onClick={initializeMemoryGame}
                className={`mt-4 px-4 py-2 text-white rounded transition-colors ${won ? 'bg-green-500' : 'bg-red-500'}`}
            >
                {(won || isMaxMovedReached()) ? "Play Again" : "Reset"}
            </button>
        }
        
    </div>
}

export default MemoryGame