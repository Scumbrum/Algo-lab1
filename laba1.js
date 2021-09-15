const PriorityQueue = require("js-priority-queue");
function heuristic(current,goal){
    let h =0;
    matrix1={
        "1":0,
        "2":0,
        "3":0,
        "4":0,
        "5":0,
        "6":0,
        "7":0,
        "8":0,
    }
    matrix2={
        "1":0,
        "2":0,
        "3":0,
        "4":0,
        "5":0,
        "6":0,
        "7":0,
        "8":0,
    }
    for(let i=0;i<current.length;i++){
        for(let j=0;j<current[i].length;j++){
            if(current[i][j]!=" " | goal[i][j]!=" "){
                matrix1[current[i][j]]=i+j
                matrix2[goal[i][j]]=i+j
            }
        }
    }
    Object.keys(matrix2).forEach((element=>{
        h+=Math.abs(matrix1[element]-matrix2[element])
    })
    )
    return h
}
class Node{
    constructor(childs,coord,deep,far,matrix){
        this.coord=coord;
        this.childs=childs;
        this.deep=deep;
        this.far=far;
        this.matrix=matrix;
    }
}
function move(matrix,delay,coord){
    let newMatrix=[["","",""],["","",""],["","",""]]
    for(let i =0;i<matrix.length;i++){
        for(let j=0;j<matrix.length;j++){
            if(i-coord[0]==delay[0] & j-coord[1]==delay[1]){
                newMatrix[i][j]=" "
            }
            else if(i==coord[0] & j==coord[1]){
                newMatrix[i][j]=matrix[coord[0]+delay[0]][coord[1]+delay[1]]
            }else{
                newMatrix[i][j]=matrix[i][j]
            }
        }
    }
    return newMatrix
}
function expand(current){
    let childs=[]
    let coord=current.coord
    let matrix=current.matrix
    let step = current.deep+1
    if(coord[0]>0){
        childs.push(new Node([],[coord[0]-1,coord[1]],step,0,move(matrix,[-1,0],coord)))
    }
    if(coord[0]<2){
        childs.push(new Node([],[coord[0]+1,coord[1]],step,0,move(matrix,[1,0],coord)))
    }
    if(coord[1]>0){
        childs.push(new Node([],[coord[0],coord[1]-1],step,0,move(matrix,[0,-1],coord)))
    }
    if(coord[1]<2){
       childs.push(new Node([],[coord[0],coord[1]+1],step,0,move(matrix,[0,1],coord)))
    }
    return childs
}
function informed(current,goal,heuristic){
    let queue = new PriorityQueue({comparator: function(node1,node2){
        return (node1.deep + node1.far) - (node2.deep + node2.far)
    }})
    let h = heuristic(current,goal)
    let step =0
    let coord=[]
    for(let i=0;i<current.length;i++){
        for(let j=0;j<current.length;j++){
            if(current[i][j]==" "){
                coord.push(i)
                coord.push(j)
            }
        }

    }
    queue.queue(new Node([],coord,0,h,current))
    while(true){
        let matrix = queue.peek().matrix
        let node = queue.dequeue()
        chek:
        for(i=0;i<3;i++){
            for(j=0;j<3;j++){
                if(matrix[i][j]!=goal[i][j]){
                    break chek
                }
            }
            if(i==2){
                return step
            }
        }
        expand(node).forEach((element) => {
            element.far = heuristic(element.matrix,goal)
            node.childs.push(element)
            queue.queue(element)
        })
        step++;
    }
}
function rDLS(current,goal,limit){
    if(current.deep>limit){
        return "Cutoff"
    }
    check:
    for(let i=0;i<goal.length;i++){
        for(let j=0;j<goal.length;j++){
            if(current.matrix[i][j]!=goal[i][j]){
                break check
            }
        }
        if(i==2){
            return current.deep
        }
    }
    let result
    let limitOccured=false
    let next= expand(current)
    for(let i=0;i<next.length;i++){
        result=rDLS(next[i],goal,limit)
        if(result!="Cutoff"){
            return result
        }
        else{
            limitOccured=true
        }
    }
    if(limitOccured){
        return "Cutoff"
    }
}
function ids(current, goal, depth){
    let coord=[]
    for(let i=0;i<current.length;i++){
        for(let j=0;j<current.length;j++){
            if(current[i][j]==" "){
                coord.push(i)
                coord.push(j)
            }
        }
    }
    let result = null
    for(let i =0;i<depth;i++){
        result = rDLS(new Node([],coord,0,-1,current),goal,i)
        
        if(result!="Cutoff"){
            return result
        }
    }
    return result
}
let current = [["1","2","3"],["4","7","5"],[" ","6","8"]]
let goal = [["1","2","3"],["4","7","5"],["6"," ","8"]]
console.log(informed(current,goal,heuristic))
console.log(ids(current,goal,3))