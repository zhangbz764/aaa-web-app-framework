package utils;

import org.locationtech.jts.algorithm.MinimumDiameter;
import org.locationtech.jts.geom.*;
import org.locationtech.jts.math.Vector2D;
import wblut.geom.*;
import wblut.hemesh.HEC_FromPolygons;
import wblut.hemesh.HEM_Extrude;
import wblut.hemesh.HE_Mesh;
import wblut.math.WB_Epsilon;

import java.util.*;

/**
 * description
 *
 * @author Baizhou Zhang zhangbz
 * @project udpro
 * @date 2024/8/23
 * @time 14:20
 */
public class UtilsZBZ {
    public static final double epsilon = 1e-5;
    public final static GeometryFactory jtsgf = new GeometryFactory();
    public final static WB_GeometryFactory wbgf = new WB_GeometryFactory();

    /*  图元数据转换  */

    /**
     * return a new normalized WB_Vector
     *
     * @param v original WB_Vector
     * @return wblut.geom.WB_Vector
     */
    public static WB_Vector normalizeWB(WB_Vector v) {
        double d = v.getLength();
        if (WB_Epsilon.isZero(d)) {
            return new WB_Vector(0.0, 0.0, 0.0);
        } else {
            return new WB_Vector(v.xd() / d, v.yd() / d, v.zd() / d);
        }
    }

    public static WB_Point CoordinateToWB_Point(final Coordinate c) {
        double z = c.getZ();
        if (Double.isNaN(z)) {
            return new WB_Point(c.getX(), c.getY(), 0);
        } else {
            return new WB_Point(c.getX(), c.getY(), c.getZ());
        }
    }

    /**
     * WB_Polygon -> WB_PolyLine
     *
     * @param polygon input WB_Polygon
     * @return wblut.geom.WB_PolyLine
     */
    public static List<WB_PolyLine> WB_PolygonToWB_PolyLine(final WB_Polygon polygon) {
        List<WB_PolyLine> result = new ArrayList<>();
        if (polygon.getNumberOfHoles() > 0) {
            // shell
            WB_Point[] shellPoints = new WB_Point[polygon.getNumberOfShellPoints()];
            for (int i = 0; i < polygon.getNumberOfShellPoints(); i++) {
                shellPoints[i] = polygon.getPoint(i);
            }
            result.add(wbgf.createPolyLine(shellPoints));

            // holes
            final int[] npc = polygon.getNumberOfPointsPerContour();
            int index = npc[0];
            for (int i = 0; i < polygon.getNumberOfHoles(); i++) {
                WB_Point[] holePoints = new WB_Point[npc[i + 1]];
                for (int j = 0; j < npc[i + 1]; j++) {
                    holePoints[j] = polygon.getPoint(index);
                    index++;
                }
                result.add(wbgf.createPolyLine(holePoints));
            }
        } else {
            WB_Point[] points = new WB_Point[polygon.getNumberOfPoints()];
            for (int i = 0; i < points.length; i++) {
                points[i] = polygon.getPoint(i);
            }
            result.add(wbgf.createPolyLine(points));
        }
        return result;
    }

    /**
     * Polygon -> WB_Polygon (holes supported)
     *
     * @param p input Polygon
     * @return wblut.geom.WB_Polygon
     */
    public static WB_Polygon PolygonToWB_Polygon(final Polygon p) {
        if (p.getNumInteriorRing() == 0) {
            WB_Coord[] points = new WB_Point[p.getNumPoints()];
            for (int i = 0; i < p.getNumPoints(); i++) {
                points[i] = CoordinateToWB_Point(p.getCoordinates()[i]);
            }
            return new WB_Polygon(points);
        } else {
            // exterior
            WB_Coord[] exteriorPoints = new WB_Point[p.getExteriorRing().getNumPoints()];
            for (int i = 0; i < p.getExteriorRing().getNumPoints(); i++) {
                exteriorPoints[i] = CoordinateToWB_Point(p.getCoordinates()[i]);
            }
            // interior
            int index = p.getExteriorRing().getNumPoints();
            WB_Coord[][] interiorHoles = new WB_Point[p.getNumInteriorRing()][];
            for (int i = 0; i < p.getNumInteriorRing(); i++) {
                LineString curr = p.getInteriorRingN(i);
                WB_Coord[] holePoints = new WB_Point[curr.getNumPoints()];
                for (int j = 0; j < curr.getNumPoints(); j++) {
                    WB_Point point = CoordinateToWB_Point(curr.getCoordinates()[j]);
                    holePoints[j] = point;
                }
                interiorHoles[i] = holePoints;
            }
            return new WB_Polygon(exteriorPoints, interiorHoles);
        }
    }

    /**
     * Polygon -> WB_Polygon (holes supported)
     *
     * @param wbp input WB_Polygon
     * @return
     */
    public static Polygon WB_PolygonToPolygon(final WB_Polygon wbp) {
        if (wbp.getNumberOfHoles() == 0) {
            if (wbp.getPoint(0).equals(wbp.getPoint(wbp.getNumberOfPoints() - 1))) {
                Coordinate[] coords = new Coordinate[wbp.getNumberOfPoints()];
                for (int i = 0; i < wbp.getNumberOfPoints() - 1; i++) {
                    coords[i] = new Coordinate(wbp.getPoint(i).xd(), wbp.getPoint(i).yd(), wbp.getPoint(i).zd());
                }
                coords[wbp.getNumberOfPoints() - 1] = coords[0];
                return jtsgf.createPolygon(coords);
            } else {
                Coordinate[] coords = new Coordinate[wbp.getNumberOfPoints() + 1];
                for (int i = 0; i < wbp.getNumberOfPoints(); i++) {
                    coords[i] = new Coordinate(wbp.getPoint(i).xd(), wbp.getPoint(i).yd(), wbp.getPoint(i).zd());
                }
                coords[wbp.getNumberOfPoints()] = coords[0];
                return jtsgf.createPolygon(coords);
            }
        } else {
            // exterior
            List<Coordinate> exteriorCoords = new ArrayList<>();
            for (int i = 0; i < wbp.getNumberOfShellPoints(); i++) {
                exteriorCoords.add(new Coordinate(wbp.getPoint(i).xd(), wbp.getPoint(i).yd(), wbp.getPoint(i).zd()));
            }
            if (!exteriorCoords.get(0).equals3D(exteriorCoords.get(exteriorCoords.size() - 1))) {
                exteriorCoords.add(exteriorCoords.get(0));
            }
            LinearRing exteriorLinearRing = jtsgf.createLinearRing(exteriorCoords.toArray(new Coordinate[0]));

            // interior
            final int[] npc = wbp.getNumberOfPointsPerContour();
            int index = npc[0];
            LinearRing[] interiorLinearRings = new LinearRing[wbp.getNumberOfHoles()];
            for (int i = 0; i < wbp.getNumberOfHoles(); i++) {
                List<Coordinate> contour = new ArrayList<>();
                for (int j = 0; j < npc[i + 1]; j++) {
                    contour.add(new Coordinate(wbp.getPoint(index).xd(), wbp.getPoint(index).yd(), wbp.getPoint(index).zd()));
                    index++;
                }
                if (!contour.get(0).equals3D(contour.get(contour.size() - 1))) {
                    contour.add(contour.get(0));
                }
                interiorLinearRings[i] = jtsgf.createLinearRing(contour.toArray(new Coordinate[0]));
            }

            return jtsgf.createPolygon(exteriorLinearRing, interiorLinearRings);
        }
    }

    /**
     * WB_PolyLine -> LineString
     *
     * @param wbp input WB_PolyLine
     * @return org.locationtech.jts.geom.LineString
     */
    public static LineString WB_PolyLineToLineString(final WB_PolyLine wbp) {
        Coordinate[] coords = new Coordinate[wbp.getNumberOfPoints()];
        for (int i = 0; i < wbp.getNumberOfPoints(); i++) {
            coords[i] = new Coordinate(wbp.getPoint(i).xd(), wbp.getPoint(i).yd(), wbp.getPoint(i).zd());
        }
        return jtsgf.createLineString(coords);
    }

    public static List<LineString> PolygonToLineString(final Polygon polygon) {
        List<LineString> result = new ArrayList<>();
        if (polygon.getNumInteriorRing() == 0) {
            result.add(jtsgf.createLineString(polygon.getCoordinates()));
        } else {
            result.add(polygon.getExteriorRing());
            for (int i = 0; i < polygon.getNumInteriorRing(); i++) {
                result.add(polygon.getInteriorRingN(i));
            }
        }
        return result;
    }

    /*  多边形朝向  */

    /**
     * reverse the order of a polygon (holes supported)
     *
     * @param original input polygon
     * @return wblut.geom.WB_Polygon
     */
    public static WB_Polygon reversePolygon(final WB_Polygon original) {
        if (original.getNumberOfHoles() == 0) {
            WB_Point[] newPoints = new WB_Point[original.getNumberOfPoints()];
            for (int i = 0; i < newPoints.length; i++) {
                newPoints[i] = original.getPoint(newPoints.length - 1 - i);
            }
            return new WB_Polygon(newPoints);
        } else {
            WB_Point[] newExteriorPoints = new WB_Point[original.getNumberOfShellPoints()];
            for (int i = 0; i < original.getNumberOfShellPoints(); i++) {
                newExteriorPoints[i] = original.getPoint(original.getNumberOfShellPoints() - 1 - i);
            }

            final int[] npc = original.getNumberOfPointsPerContour();
            int index = npc[0];
            WB_Point[][] newInteriorPoints = new WB_Point[original.getNumberOfHoles()][];

            for (int i = 0; i < original.getNumberOfHoles(); i++) {
                WB_Point[] newHole = new WB_Point[npc[i + 1]];
                for (int j = 0; j < newHole.length; j++) {
                    newHole[j] = new WB_Point(original.getPoint(newHole.length - 1 - j + index));
                }
                newInteriorPoints[i] = newHole;
                index = index + npc[i + 1];
            }

            return new WB_Polygon(newExteriorPoints, newInteriorPoints);
        }
    }

    /**
     * make a polygon face up (normal vector is in the z direction) (holes supported)
     *
     * @param polygon input polygon
     * @return wblut.geom.WB_Polygon
     */
    public static WB_Polygon polygonFaceUp(final WB_Polygon polygon) {
        if (polygon.getNormal().zd() < 0) {
            return reversePolygon(polygon);
        } else {
            return polygon;
        }
    }

    /**
     * make a polygon face up (normal vector is in the reverse z direction) (holes supported)
     *
     * @param polygon input polygon
     * @return wblut.geom.WB_Polygon
     */
    public static WB_Polygon polygonFaceDown(final WB_Polygon polygon) {
        if (polygon.getNormal().zd() > 0) {
            return reversePolygon(polygon);
        } else {
            return polygon;
        }
    }

    /*  多边形剖分  */

    /**
     * giving step and shaking threshold to divide a WB_PolyLine or WB_Polygon (WB_PolyLine)
     *
     * @param poly  input polyline (polygon)
     * @param step  step to divide
     * @param shake threshold to shake
     */
    public static List<WB_Point> dividePolyLineByRandomStep(final Random rand, final WB_PolyLine poly, final double step, final double shake, final double minStep) {
        WB_Coord[] polyPoints = poly.getPoints().toArray();

        WB_Point start = (WB_Point) polyPoints[0];
        WB_Point end = (WB_Point) polyPoints[polyPoints.length - 1];

        WB_Point p1 = start;
        double curr_span = step + rand.nextDouble(2 * shake) - shake;
        double curr_dist;

        List<WB_Point> result = new ArrayList<>();
        result.add(p1);
        for (int i = 1; i < poly.getNumberOfPoints(); i++) {
            WB_Point p2 = (WB_Point) polyPoints[i];
            curr_dist = p1.getDistance2D(p2);
            while (curr_dist >= curr_span) {
                WB_Point p = p1.add(normalizeWB(p2.sub(p1)).scale(curr_span));
                result.add(p);
                p1 = p;
                curr_span = step + rand.nextDouble(2 * shake) - shake;
                curr_dist = p1.getDistance2D(p2);
            }
            p1 = p2;
            curr_span = curr_span - curr_dist;
        }

        if (poly instanceof WB_Ring) {
            if (start.getDistance2D(result.get(result.size() - 1)) < epsilon) {
                result.remove(result.size() - 1);
            }
        } else {
            if (end.getDistance2D(result.get(result.size() - 1)) > epsilon) {
                result.add(end);
            }
        }

        if (result.size() > 1 && start.getDistance2D(result.get(result.size() - 1)) < minStep) {
            result.remove(result.size() - 1);
        }

        return result;
    }

    public static List<WB_Point> divideSegmentByRandomStep(final Random random, final WB_Point start, final WB_Point end, final double min, final double max, boolean bigWindow, double bigWindowSpan) {
        List<WB_Point> results = new ArrayList<>();
        if (min > max || min < 0 || max <= 0) {
            return results;
        }

        WB_Vector segDir = new WB_Vector(start, end);
        segDir.normalizeSelf();

        double curr_dist = start.getDistance(end);


        WB_Point currPt = start;
        while (curr_dist > max) {
            double step;
            if (min == max) {
                step = max;
            } else {
                step = random.nextDouble(max - min) + min;
            }
            if (bigWindow && curr_dist > bigWindowSpan) {
                if (random.nextDouble() > 0.9) {
                    step = bigWindowSpan;
                }
            }

            WB_Point pt = currPt.add(segDir.scale(step));
            results.add(pt);
            currPt = pt;
            curr_dist -= step;

        }


        return results;
    }

    /*  多边形特性  */

    /**
     * get two-direction span of an OBB
     *
     * @param poly WB_Polygon
     * @return double[]
     */
    public static double[] obbSpan(WB_Polygon poly) {
        Polygon p = UtilsZBZ.WB_PolygonToPolygon(poly);
        Polygon bufferOBB = (Polygon) MinimumDiameter.getMinimumRectangle(p);
        double obbW1 = bufferOBB.getCoordinates()[0].distance(bufferOBB.getCoordinates()[1]);
        double obbW2 = bufferOBB.getCoordinates()[0].distance(bufferOBB.getCoordinates()[3]);

        return obbW1 > obbW2 ? new double[]{obbW1, obbW2} : new double[]{obbW2, obbW1};
    }

    /**
     * get the direction of a OBB
     *
     * @param polygon input polygon
     */
    public static WB_Vector[] obbDir(final WB_Polygon polygon) {
        Polygon rect = (Polygon) MinimumDiameter.getMinimumRectangle(WB_PolygonToPolygon(polygon));
        Coordinate c0 = rect.getCoordinates()[0];
        Coordinate c1 = rect.getCoordinates()[1];
        Coordinate c2 = rect.getCoordinates()[2];

        WB_Vector dir1 = new WB_Vector(
                new double[]{c1.getX(), c1.getY()},
                new double[]{c0.getX(), c0.getY()}
        );
        dir1.normalizeSelf();
        WB_Vector dir2 = new WB_Vector(
                new double[]{c1.getX(), c1.getY()},
                new double[]{c2.getX(), c2.getY()}
        );
        dir2.normalizeSelf();
        return c0.distance(c1) >= c1.distance(c2) ? new WB_Vector[]{dir2, dir1} : new WB_Vector[]{dir1, dir2};
    }


    /**
     * get the direction of a OBB
     *
     * @param polygon Polygon
     * @return org.locationtech.jts.math.Vector2D[]
     */
    public static Vector2D[] obbDir(final Polygon polygon) {
        Polygon rect = (Polygon) MinimumDiameter.getMinimumRectangle(polygon);
        Coordinate c0 = rect.getCoordinates()[0];
        Coordinate c1 = rect.getCoordinates()[1];
        Coordinate c2 = rect.getCoordinates()[2];

        Vector2D dir1 = new Vector2D(c1, c0).normalize();
        Vector2D dir2 = new Vector2D(c1, c2).normalize();

        return c0.distance(c1) >= c1.distance(c2) ? new Vector2D[]{dir2, dir1} : new Vector2D[]{dir1, dir2};
    }

    /*  创建图元  */

    public static LineString createExtendedLineString(final LineString ls, final double dist) {
        Coordinate[] coords = ls.getCoordinates();

        if (coords.length > 2) {
            Coordinate[] newCoords = new Coordinate[coords.length];

            Coordinate p0 = coords[0];
            Coordinate p1 = coords[1];
            Coordinate p2 = coords[coords.length - 2];
            Coordinate p3 = coords[coords.length - 1];

            Vector2D v1 = new Vector2D(p1, p0).normalize();
            Vector2D v2 = new Vector2D(p2, p3).normalize();

            Coordinate newC0 = Vector2D.create(p0).add(v1.multiply(dist)).toCoordinate();
            Coordinate newC3 = Vector2D.create(p3).add(v2.multiply(dist)).toCoordinate();

            newCoords[0] = newC0;
            System.arraycopy(coords, 1, newCoords, 1, coords.length - 1 - 1);
            newCoords[coords.length - 1] = newC3;

            return jtsgf.createLineString(newCoords);
        } else if (coords.length == 2) {
            Coordinate p0 = coords[0];
            Coordinate p1 = coords[1];

            Vector2D v1 = new Vector2D(p1, p0).normalize();
            Vector2D v2 = new Vector2D(p0, p1).normalize();

            Coordinate newC0 = Vector2D.create(p0).add(v1.multiply(dist)).toCoordinate();
            Coordinate newC1 = Vector2D.create(p1).add(v2.multiply(dist)).toCoordinate();

            return jtsgf.createLineString(new Coordinate[]{newC0, newC1});
        } else {
            return ls;
        }
    }

    public static HE_Mesh extrude(WB_Polygon base, double extrudeSize) {
        if (base == null) return null;

        // use a face-down polygon as the base face of the mesh
        double signedArea = base.getSignedArea();
        WB_Polygon basePoly;
        WB_Polygon basePolyRev;
        if (signedArea > 0) {
            basePoly = validateWB_Polygon(reversePolygon(base));
            basePolyRev = validateWB_Polygon(base);
        } else {
            basePoly = validateWB_Polygon(base);
            basePolyRev = validateWB_Polygon(reversePolygon(base));
        }

        // mesh creator
        HEC_FromPolygons creator = new HEC_FromPolygons();
        List<WB_Polygon> meshPolyFaceList = new ArrayList<>();

        // base
        meshPolyFaceList.add(copySimple_WB_Polygon(basePoly));
        // side
        for (int i = 0; i < basePoly.getNumberOfPoints() - 1; i++) {
            WB_Point p0 = basePoly.getPoint(i + 1).copy();
            WB_Point p1 = basePoly.getPoint(i).copy();
            WB_Point p2 = p1.add(0, 0, extrudeSize);
            WB_Point p3 = p0.add(0, 0, extrudeSize);

            WB_Polygon sideFace = wbgf.createSimplePolygon(p0, p1, p2, p3, p0);
            meshPolyFaceList.add(sideFace);
        }
        HEM_Extrude m = new HEM_Extrude();

        // top
        WB_Point[] topFacePts = new WB_Point[basePolyRev.getNumberOfPoints()];
        for (int i = 0; i < basePolyRev.getNumberOfPoints(); i++) {
            WB_Point _p = basePolyRev.getPoint(i);
            WB_Point p = new WB_Point(_p.xd(), _p.yd(), _p.zd() + extrudeSize);
            topFacePts[i] = p;
        }
        WB_Polygon topFace = wbgf.createSimplePolygon(topFacePts);
        meshPolyFaceList.add(topFace);

        creator.setPolygons(meshPolyFaceList);
        return new HE_Mesh(creator);
    }

    /**
     * check the start point and the end point of a WB_Polygon
     * validate WB_Polygon (holes supported)
     *
     * @param polygon input WB_Polygon
     * @return wblut.geom.WB_Polygon
     */
    public static WB_Polygon validateWB_Polygon(final WB_Polygon polygon) {
        if (polygon.getNumberOfHoles() == 0) {
            if (polygon.getPoint(0).equals(polygon.getPoint(polygon.getNumberOfPoints() - 1))) {
                return polygon;
            } else {
                List<WB_Coord> points = polygon.getPoints().toList();
                points.add(polygon.getPoint(0));
                return wbgf.createSimplePolygon(points);
            }
        } else {
            boolean flag = true;
            List<WB_Point> exterior = new ArrayList<>();
            for (int i = 0; i < polygon.getNumberOfShellPoints(); i++) {
                exterior.add(polygon.getPoint(i));
            }
            if (!exterior.get(0).equals(exterior.get(exterior.size() - 1))) {
                flag = false;
                exterior.add(exterior.get(0));
            }

            WB_Point[][] interior = new WB_Point[polygon.getNumberOfHoles()][];
            int[] npc = polygon.getNumberOfPointsPerContour();
            int index = npc[0];
            for (int i = 0; i < polygon.getNumberOfHoles(); i++) {
                List<WB_Point> contour = new ArrayList<>();
                for (int j = 0; j < npc[i + 1]; j++) {
                    contour.add(polygon.getPoint(index));
                    index = index + 1;
                }
                if (!contour.get(0).equals(contour.get(contour.size() - 1))) {
                    flag = false;
                    contour.add(contour.get(0));
                }
                interior[i] = contour.toArray(new WB_Point[0]);
            }
            if (flag) {
                return polygon;
            } else {
                return wbgf.createPolygonWithHoles(exterior.toArray(new WB_Point[0]), interior);
            }
        }
    }

    public static WB_Polygon copySimple_WB_Polygon(WB_Polygon polygon) {
        List<WB_Point> cs = new ArrayList<>();
        int numberOfPoints = polygon.getNumberOfPoints();
        for (int i = 0; i < numberOfPoints; i++) {
            WB_Point p = polygon.getPoint(i);
            cs.add(new WB_Point(p.xd(), p.yd(), p.zd()));
        }
        return wbgf.createSimplePolygon(cs);
    }

    public static LineString extendSegmentToPolygon(final Vector2D[] segment, final Polygon poly) {
        List<Coordinate> interResult = rayPolygonIntersection2D(segment, poly);
        if (!interResult.isEmpty()) {
            for (int i = 0; i < interResult.size(); i++) {
                if (interResult.get(i).distance(segment[0].toCoordinate()) < epsilon) {
                    interResult.remove(i--);
                }
            }
        }
        if (interResult.size() > 1) {
            double[] resultDist = new double[interResult.size()];
            for (int i = 0; i < interResult.size(); i++) {
                resultDist[i] = segment[0].toCoordinate().distance(interResult.get(i));
            }
            int[] ascending = getArraySortedIndices(resultDist);
            return jtsgf.createLineString(new Coordinate[]{
                    segment[0].toCoordinate(), interResult.get(ascending[0])
            });
        } else if (interResult.size() == 1) {
            return jtsgf.createLineString(new Coordinate[]{
                    segment[0].toCoordinate(), interResult.get(0)
            });
        } else {
            return null;
        }
    }

    /**
     * 2D cross product for jts Vector2D
     *
     * @param v1 v1
     * @param v2 v2
     * @return double
     */
    public static double cross2D(Vector2D v1, Vector2D v2) {
        return v1.getX() * v2.getY() - v1.getY() * v2.getX();
    }

    public static List<Coordinate> rayPolygonIntersection2D(final Vector2D[] ray, final Polygon poly) {
        List<Coordinate> result = new ArrayList<>();

        for (int i = 0; i < poly.getCoordinates().length - 1; i++) {
            Coordinate c0 = poly.getCoordinates()[i];
            Coordinate c1 = poly.getCoordinates()[i + 1];
            Vector2D[] polySeg = new Vector2D[]{
                    Vector2D.create(c0),
                    new Vector2D(c0, c1)
            };

            Coordinate intersect = null;
            Vector2D delta = polySeg[0].subtract(ray[0]);
            double crossBase = cross2D(ray[1], polySeg[1]);
            double crossDelta0 = cross2D(delta, ray[1]);
            double crossDelta1 = cross2D(delta, polySeg[1]);

            if (Math.abs(crossBase) >= epsilon) {
                double s = crossDelta1 / crossBase; // ray
                double t = crossDelta0 / crossBase; // seg
                if (s >= 0 && t >= 0 && t < 1) {
                    intersect = polySeg[0].add(polySeg[1].multiply(t)).toCoordinate();
                }
            }

            if (intersect != null) {
                result.add(intersect);
            }
        }
        return result;
    }

    /*  数学  */

    /**
     * sort a double by ascending order (return indices)
     *
     * @param arr array to be sorted
     * @return int[] - indices of input array
     */
    public static int[] getArraySortedIndices(final double[] arr) {
        int[] sortedIndices = new int[arr.length];

        // build relations between array value and index
        HashMap<Double, Integer> relation = new HashMap<>();
        for (int i = 0; i < arr.length; i++) {
            relation.put(arr[i], i);
        }

        // use Arrays.sort() to sort input array (ascending order)
        double[] sorted_arr = Arrays.copyOf(arr, arr.length);
        Arrays.sort(sorted_arr);

        // find orginal index of each value in sorted array
        for (int j = 0; j < sorted_arr.length; j++) {
            sortedIndices[j] = relation.get(sorted_arr[j]);
        }
        return sortedIndices;
    }
}
