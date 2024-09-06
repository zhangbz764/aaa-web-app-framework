/**
 * some static functions of geometries
 *
 * @author Baizhou Zhang zhangbz
 * @project typology-generator-web
 * @date 2023/4/6
 * @time 16:19
 */
import {Coordinate, GeometryFactory} from "jsts/org/locationtech/jts/geom";
import {BufferOp, BufferParameters} from "jsts/org/locationtech/jts/operation/buffer";
import * as ARCH from "@inst-aaa/archiweb-core";
import {RelateOp} from "jsts/org/locationtech/jts/operation/relate";

export default class GeoUtils {
    static distEpsilon = 5
    static distEpsilonPrecise = 1
    static gf = new GeometryFactory()

    /**
     * check if a new vector is overlap with a list of vectors
     * @param newVec
     * @param vecList
     * @param epsilon
     * @returns {*}
     */
    static checkOverlapWithVecs(newVec, vecList, epsilon) {
        for (let tempV of vecList) {
            const distSq = (tempV.x - newVec.x) * (tempV.x - newVec.x) + (tempV.y - newVec.y) * (tempV.y - newVec.y)
            if (distSq <= epsilon) {
                return tempV
            }
        }
    }

    /**
     * square distance of 2 vectors or points
     * @returns {number}
     * @param pt1
     * @param pt2
     */
    static ptDistSq2D(pt1, pt2) {
        return (pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y)
    }

    /**
     * create prism from a segment (2 pts)
     * @param viewport
     * @param p1
     * @param p2
     * @param bufferDist
     * @param height
     * @param material
     * @returns {Prism}
     */
    static createPrismFromSeg(viewport, p1, p2, bufferDist, height, material) {
        const coords = [
            new Coordinate(p1.x, p1.y, 0),
            new Coordinate(p2.x, p2.y, 0),
        ]
        const ls = this.gf.createLineString(coords)
        const bufferOp = new BufferOp(ls)
        // bufferOp.setEndCapStyle(BufferParameters.CAP_FLAT)
        bufferOp.setQuadrantSegments(5)
        const buffer = bufferOp.getResultGeometry(bufferDist)

        const segBufferCoords = []
        buffer.getCoordinates().forEach(c => {
            segBufferCoords.push(c.x)
            segBufferCoords.push(c.y)
            segBufferCoords.push(0)
        })
        // segBufferCoords.reverse()
        return new ARCH.Prism(
            viewport,
            {
                segments: {coordinates: segBufferCoords, size: 3},
                height: height,
                showEdge: false,
                material: material
            }
        )
    }

    /**
     * create Segments from a segment (2 pts)
     * @param viewport
     * @param p1
     * @param p2
     * @param bufferDist
     * @param material
     * @returns {Segments}
     */
    static createSegmentsFromSeg(viewport, p1, p2, bufferDist, material) {
        const coords = [
            new Coordinate(p1.x, p1.y, 0),
            new Coordinate(p2.x, p2.y, 0),
        ]
        const ls = this.gf.createLineString(coords)
        const bufferOp = new BufferOp(ls)
        bufferOp.setEndCapStyle(BufferParameters.CAP_FLAT)
        const buffer = bufferOp.getResultGeometry(bufferDist)

        const segBufferCoords = []
        buffer.getCoordinates().forEach(c => {
            segBufferCoords.push(c.x)
            segBufferCoords.push(c.y)
            segBufferCoords.push(0)
        })
        return new ARCH.Segments(
            viewport,
            {
                coordinates: segBufferCoords,
                size: 3,
                closed: true,
                lineMaterial: material
            }
        )
    }

    /**
     *  create jste Polygon from ArchiJSON Segments
     * @param segments
     * @returns {*|Polygon}
     */
    static createJSTSPolygonFromSegments(segments) {
        let polyCoords = []
        for (let pt of segments.points) {
            polyCoords.push(new Coordinate(pt.x, pt.y))
        }
        polyCoords.push(new Coordinate(segments.points[0].x, segments.points[0].y))
        return this.gf.createPolygon(polyCoords)
    }

    /**
     * create buffer Segments from Segments
     * @param viewport
     * @param seg
     * @param bufferDist
     * @param material
     * @returns {*[]}
     */
    static createSegmentsBufferFromSegments(viewport, seg, bufferDist, material) {
        let bufferSegments = []
        for (let i = 0; i < seg.points.length - 1; i++) {
            const p1 = seg.points[i]
            const p2 = seg.points[i + 1]
            const segBuffer = this.createSegmentsFromSeg(viewport, p1, p2, bufferDist, material)
            bufferSegments.push(segBuffer)
        }
        if (seg.closed) {
            if (this.ptDistSq2D(seg.points[0], seg.points[seg.points.length - 1]) < this.distEpsilonPrecise) {
                bufferSegments.push(this.createSegmentsFromSeg(viewport, seg.points[seg.points.length - 1], seg.points[0], bufferDist, material))
            }
        }

        return bufferSegments
    }

    /**
     * create buffer prisms from Segments
     * @param viewport
     * @param seg
     * @param bufferDist
     * @param height
     * @param material
     * @returns {*[]}
     */
    static createPrismBufferFromSegments(viewport, seg, bufferDist, height, material) {
        let bufferPrisms = []
        for (let i = 0; i < seg.points.length - 1; i++) {
            const p1 = seg.points[i]
            const p2 = seg.points[i + 1]
            const segBuffer = this.createPrismFromSeg(viewport, p1, p2, bufferDist, height, material)
            bufferPrisms.push(segBuffer)
        }
        if (seg.closed) {
            if (this.ptDistSq2D(seg.points[0], seg.points[seg.points.length - 1]) > this.distEpsilonPrecise) {
                bufferPrisms.push(this.createPrismFromSeg(viewport, seg.points[seg.points.length - 1], seg.points[0], bufferDist, height, material))
            }
        }
        return bufferPrisms
    }

    /**
     * check if any polygon contains the given coordinate
     * @param poly
     * @param vec
     * @returns {boolean}
     */
    static checkContains(poly, vec) {
        const point = this.gf.createPoint(new Coordinate(vec.x, vec.y, vec.z))
        return RelateOp.contains(poly, point)
    }

    /**
     * calculate area from polygon points
     * @param points
     * @returns {string}
     */
    static calculatePolygonArea(points) {
        let n = points.length;
        let area = 0;

        for (let i = 0; i < n - 1; i++) {
            let j = i + 1;
            area += points[i].x * points[j].y;
            area -= points[j].x * points[i].y;
        }

        area = Math.abs(area) / 2;
        return area.toFixed(2); // 保留小数点后两位
    }
}