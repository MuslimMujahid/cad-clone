const mapValue = (value, min1, max1, min2, max2) => {

    return (value*(max2-min2) - max2*min1 + min2*max1)/(max1-min1)
}