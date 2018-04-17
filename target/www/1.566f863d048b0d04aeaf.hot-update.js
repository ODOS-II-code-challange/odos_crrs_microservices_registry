webpackHotUpdate(1,{

/***/ "./node_modules/reflect-metadata/Reflect.ts":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(2)))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L3JlZmxlY3QtbWV0YWRhdGEvUmVmbGVjdC50cz9mMWUxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Z0ZBYWdGO0FBQ2hGLElBQVUsT0FBTyxDQW9xRGhCO0FBcHFERCxXQUFVLE9BQU87SUFDYixZQUFZLENBQUM7SUF3RmIsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7SUFFL0Msa0NBQWtDO0lBQ2xDLElBQU0sY0FBYyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsQ0FBQztJQUNwRCxJQUFNLGlCQUFpQixHQUFHLGNBQWMsSUFBSSxPQUFPLE1BQU0sQ0FBQyxXQUFXLEtBQUssV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsZUFBZSxDQUFDO0lBQzdILElBQU0sY0FBYyxHQUFHLGNBQWMsSUFBSSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEtBQUssV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO0lBRWpILElBQVUsT0FBTyxDQW1CaEI7SUFuQkQsV0FBVSxPQUFPO1FBQ2IsSUFBTSxjQUFjLEdBQUcsT0FBTyxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLHlDQUF5QztRQUNyRyxJQUFNLGFBQWEsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLENBQUMsQ0FBQyxxQ0FBcUM7UUFDL0YsSUFBTSxTQUFTLEdBQUcsQ0FBQyxjQUFjLElBQUksQ0FBQyxhQUFhLENBQUM7UUFFcEQsaUVBQWlFO1FBQ3BELGNBQU0sR0FBRyxjQUFjO2NBQzlCLGNBQVMscUJBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBZSxDQUFDLEVBQWpELENBQWlEO2NBQzFELGFBQWE7a0JBQ1QsY0FBUyxxQkFBYyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQVcsRUFBZ0IsQ0FBQyxFQUF4RCxDQUF3RDtrQkFDakUsY0FBUyxxQkFBYyxDQUFDLEVBQWdCLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQztRQUV2QyxXQUFHLEdBQUcsU0FBUztjQUN0QixVQUFJLEdBQWUsRUFBRSxHQUE2QixJQUFLLGFBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFyQixDQUFxQjtjQUM1RSxVQUFJLEdBQWUsRUFBRSxHQUE2QixJQUFLLFVBQUcsSUFBSSxHQUFHLEVBQVYsQ0FBVSxDQUFDO1FBRTNELFdBQUcsR0FBRyxTQUFTO2NBQ3RCLFVBQUksR0FBZSxFQUFFLEdBQTZCLElBQW9CLGFBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLEVBQTVDLENBQTRDO2NBQ2xILFVBQUksR0FBZSxFQUFFLEdBQTZCLElBQW9CLFVBQUcsQ0FBQyxHQUFHLENBQUMsRUFBUixDQUFRLENBQUM7SUFDekYsQ0FBQyxFQW5CUyxPQUFPLEtBQVAsT0FBTyxRQW1CaEI7SUFFRCx3REFBd0Q7SUFDeEQsSUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFELElBQU0sV0FBVyxHQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsS0FBSyxNQUFNLENBQUM7SUFDOUgsSUFBTSxJQUFJLEdBQWUsQ0FBQyxXQUFXLElBQUksT0FBTyxHQUFHLEtBQUssVUFBVSxJQUFJLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEtBQUssVUFBVSxHQUFHLEdBQUcsR0FBRyxpQkFBaUIsRUFBRSxDQUFDO0lBQzlJLElBQU0sSUFBSSxHQUFlLENBQUMsV0FBVyxJQUFJLE9BQU8sR0FBRyxLQUFLLFVBQVUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxLQUFLLFVBQVUsR0FBRyxHQUFHLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztJQUM5SSxJQUFNLFFBQVEsR0FBbUIsQ0FBQyxXQUFXLElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxHQUFHLE9BQU8sR0FBRyxxQkFBcUIsRUFBRSxDQUFDO0lBRW5ILDZCQUE2QjtJQUM3QixtR0FBbUc7SUFDbkcsSUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQXdELENBQUM7SUE0RnRGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXNDSTtJQUNKLGtCQUF5QixVQUFnRCxFQUFFLE1BQVcsRUFBRSxXQUE2QixFQUFFLFVBQXNDO1FBQ3pKLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFBQyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNwRyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztZQUMvQyxXQUFXLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBb0IsVUFBVSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUNELElBQUksQ0FBQyxDQUFDO1lBQ0YsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNsRCxNQUFNLENBQUMsbUJBQW1CLENBQW1CLFVBQVUsRUFBWSxNQUFNLENBQUMsQ0FBQztRQUMvRSxDQUFDO0lBQ0wsQ0FBQztJQWRlLGdCQUFRLFdBY3ZCO0lBRUQscURBQXFEO0lBQ3JELGdFQUFnRTtJQUVoRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBdUNJO0lBQ0osa0JBQXlCLFdBQWdCLEVBQUUsYUFBa0I7UUFHekQsbUJBQW1CLE1BQVcsRUFBRSxXQUE2QjtZQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFBQyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7WUFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ3BGLHlCQUF5QixDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFUZSxnQkFBUSxXQVN2QjtJQStERDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFzQ0k7SUFDSix3QkFBK0IsV0FBZ0IsRUFBRSxhQUFrQixFQUFFLE1BQVcsRUFBRSxXQUE2QjtRQUMzRyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUFDLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEUsTUFBTSxDQUFDLHlCQUF5QixDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFKZSxzQkFBYyxpQkFJN0I7SUFxREQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWlDSTtJQUNKLHFCQUE0QixXQUFnQixFQUFFLE1BQVcsRUFBRSxXQUE2QjtRQUNwRixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUFDLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEUsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUplLG1CQUFXLGNBSTFCO0lBcUREOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFpQ0k7SUFDSix3QkFBK0IsV0FBZ0IsRUFBRSxNQUFXLEVBQUUsV0FBNkI7UUFDdkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFBQyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFBQyxXQUFXLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFKZSxzQkFBYyxpQkFJN0I7SUFxREQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWlDSTtJQUNKLHFCQUE0QixXQUFnQixFQUFFLE1BQVcsRUFBRSxXQUE2QjtRQUNwRixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUFDLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEUsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUplLG1CQUFXLGNBSTFCO0lBcUREOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFpQ0k7SUFDSix3QkFBK0IsV0FBZ0IsRUFBRSxNQUFXLEVBQUUsV0FBNkI7UUFDdkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFBQyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFBQyxXQUFXLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFKZSxzQkFBYyxpQkFJN0I7SUFtREQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBZ0NJO0lBQ0oseUJBQWdDLE1BQVcsRUFBRSxXQUE2QjtRQUN0RSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUFDLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEUsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBSmUsdUJBQWUsa0JBSTlCO0lBbUREOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWdDSTtJQUNKLDRCQUFtQyxNQUFXLEVBQUUsV0FBNkI7UUFDekUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFBQyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFBQyxXQUFXLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUplLDBCQUFrQixxQkFJakM7SUFxREQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWlDSTtJQUNKLHdCQUErQixXQUFnQixFQUFFLE1BQVcsRUFBRSxXQUE2QjtRQUN2RixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUFDLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEUsSUFBTSxXQUFXLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEYsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUN0QyxJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLGNBQWMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3pDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBWmUsc0JBQWMsaUJBWTdCO0lBRUQsNkJBQTZCLFVBQTRCLEVBQUUsTUFBZ0I7UUFDdkUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzlDLElBQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFBQyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7Z0JBQ3JELE1BQU0sR0FBYSxTQUFTLENBQUM7WUFDakMsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCwwQkFBMEIsVUFBNkIsRUFBRSxNQUFXLEVBQUUsV0FBNEIsRUFBRSxVQUEwQztRQUMxSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDOUMsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQUMsTUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDO2dCQUNoRCxVQUFVLEdBQXVCLFNBQVMsQ0FBQztZQUMvQyxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQU1ELGdDQUFnQyxDQUFNLEVBQUUsQ0FBOEIsRUFBRSxNQUFlO1FBQ25GLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQzlCLGNBQWMsR0FBRyxJQUFJLElBQUksRUFBOEMsQ0FBQztZQUN4RSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsSUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDOUIsV0FBVyxHQUFHLElBQUksSUFBSSxFQUFZLENBQUM7WUFDbkMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxtRUFBbUU7SUFDbkUsNkJBQTZCLFdBQWdCLEVBQUUsQ0FBTSxFQUFFLENBQThCO1FBQ2pGLElBQU0sTUFBTSxHQUFHLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFNLE1BQU0sR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELG9EQUFvRDtJQUNwRCxzRUFBc0U7SUFDdEUsZ0NBQWdDLFdBQWdCLEVBQUUsQ0FBTSxFQUFFLENBQThCO1FBQ3BGLElBQU0sV0FBVyxHQUFHLHNCQUFzQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25FLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDM0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxtRUFBbUU7SUFDbkUsNkJBQTZCLFdBQWdCLEVBQUUsQ0FBTSxFQUFFLENBQThCO1FBQ2pGLElBQU0sTUFBTSxHQUFHLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBTSxNQUFNLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxvREFBb0Q7SUFDcEQsc0VBQXNFO0lBQ3RFLGdDQUFnQyxXQUFnQixFQUFFLENBQU0sRUFBRSxDQUE4QjtRQUNwRixJQUFNLFdBQVcsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxzRUFBc0U7SUFDdEUseUVBQXlFO0lBQ3pFLG1DQUFtQyxXQUFnQixFQUFFLGFBQWtCLEVBQUUsQ0FBTSxFQUFFLENBQThCO1FBQzNHLElBQU0sV0FBVyxHQUFHLHNCQUFzQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xFLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxxQ0FBcUM7SUFDckMsb0VBQW9FO0lBQ3BFLDhCQUE4QixDQUFNLEVBQUUsQ0FBOEI7UUFDaEUsSUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlDLElBQU0sTUFBTSxHQUFHLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ3BDLElBQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDM0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQzNDLElBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFPLENBQUM7UUFDNUIsSUFBTSxJQUFJLEdBQVUsRUFBRSxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxDQUFjLFVBQU8sRUFBUCxtQkFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztZQUFwQixJQUFNLEdBQUc7WUFDVixJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDVixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsQ0FBQztTQUNKO1FBQ0QsR0FBRyxDQUFDLENBQWMsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1lBQXZCLElBQU0sR0FBRztZQUNWLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNWLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQixDQUFDO1NBQ0o7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCx3Q0FBd0M7SUFDeEMsdUVBQXVFO0lBQ3ZFLGlDQUFpQyxDQUFNLEVBQUUsQ0FBOEI7UUFDbkUsSUFBTSxJQUFJLEdBQVUsRUFBRSxDQUFDO1FBQ3ZCLElBQU0sV0FBVyxHQUFHLHNCQUFzQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25FLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDMUMsSUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25DLElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixPQUFPLElBQUksRUFBRSxDQUFDO1lBQ1YsSUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBQ0QsSUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQztnQkFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQ3hCLENBQUM7WUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksQ0FBQztvQkFDRCxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzVCLENBQUM7d0JBQ08sQ0FBQztvQkFDTCxNQUFNLENBQUMsQ0FBQztnQkFDWixDQUFDO1lBQ0wsQ0FBQztZQUNELENBQUMsRUFBRSxDQUFDO1FBQ1IsQ0FBQztJQUNMLENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsdUVBQXVFO0lBQ3ZFLGNBQWMsQ0FBTTtRQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLFlBQVEsQ0FBQztRQUNoQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixLQUFLLFdBQVcsRUFBRSxNQUFNLENBQUMsaUJBQWEsQ0FBQztZQUN2QyxLQUFLLFNBQVMsRUFBRSxNQUFNLENBQUMsZUFBVyxDQUFDO1lBQ25DLEtBQUssUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFVLENBQUM7WUFDakMsS0FBSyxRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQVUsQ0FBQztZQUNqQyxLQUFLLFFBQVEsRUFBRSxNQUFNLENBQUMsY0FBVSxDQUFDO1lBQ2pDLEtBQUssUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEtBQUssSUFBSSxHQUFHLFlBQVEsR0FBRyxjQUFVLENBQUM7WUFDekQsU0FBUyxNQUFNLENBQUMsY0FBVSxDQUFDO1FBQy9CLENBQUM7SUFDTCxDQUFDO0lBY0QsMkJBQTJCO0lBQzNCLCtFQUErRTtJQUMvRSxxQkFBcUIsQ0FBTTtRQUN2QixNQUFNLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQztJQUMzQixDQUFDO0lBRUQsc0JBQXNCO0lBQ3RCLDBFQUEwRTtJQUMxRSxnQkFBZ0IsQ0FBTTtRQUNsQixNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLDRFQUE0RTtJQUM1RSxrQkFBa0IsQ0FBTTtRQUNwQixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDO0lBQ2pDLENBQUM7SUFFRCx3QkFBd0I7SUFDeEIsa0RBQWtEO0lBQ2xELGtCQUFxQixDQUE0RDtRQUM3RSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssVUFBVSxDQUFDO0lBQ3hFLENBQUM7SUFFRCxzQkFBc0I7SUFDdEIsc0RBQXNEO0lBRXRELDZDQUE2QztJQUM3QyxrREFBa0Q7SUFDbEQscUJBQXFCLEtBQVUsRUFBRSxhQUFtQjtRQUNoRCxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEtBQUssaUJBQWEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pDLEtBQUssWUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDNUIsS0FBSyxlQUFXLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUMvQixLQUFLLGNBQVUsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzlCLEtBQUssY0FBVSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDOUIsS0FBSyxjQUFVLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNsQyxDQUFDO1FBQ0QsSUFBTSxJQUFJLEdBQW9DLGFBQWEsS0FBSyxjQUFVLEdBQUcsUUFBUSxHQUFHLGFBQWEsS0FBSyxjQUFVLEdBQUcsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUM1SSxJQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDekQsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLElBQUksS0FBSyxTQUFTLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCx1Q0FBdUM7SUFDdkMsMERBQTBEO0lBQzFELDZCQUE2QixDQUFNLEVBQUUsSUFBeUI7UUFDMUQsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBTSxVQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFNLE1BQU0sR0FBRyxVQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3pDLENBQUM7WUFDRCxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDekMsQ0FBQztRQUNMLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNGLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN6QyxDQUFDO1lBQ0QsSUFBTSxVQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFNLE1BQU0sR0FBRyxVQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3pDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCw0QkFBNEI7SUFDNUIscURBQXFEO0lBQ3JELG1CQUFtQixRQUFhO1FBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQ3RCLENBQUM7SUFFRCw0QkFBNEI7SUFDNUIsK0NBQStDO0lBQy9DLGtCQUFrQixRQUFhO1FBQzNCLE1BQU0sQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxpQ0FBaUM7SUFDakMsb0RBQW9EO0lBQ3BELHVCQUF1QixRQUFhO1FBQ2hDLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsY0FBVSxDQUFDLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCx3Q0FBd0M7SUFDeEMsd0VBQXdFO0lBRXhFLDBCQUEwQjtJQUMxQiw4Q0FBOEM7SUFDOUMsaUJBQWlCLFFBQWE7UUFDMUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPO2NBQ2QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7Y0FDdkIsUUFBUSxZQUFZLE1BQU07a0JBQ3RCLFFBQVEsWUFBWSxLQUFLO2tCQUN6QixNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssZ0JBQWdCLENBQUM7SUFDNUUsQ0FBQztJQUVELDZCQUE2QjtJQUM3QixpREFBaUQ7SUFDakQsb0JBQW9CLFFBQWE7UUFDN0Isa0ZBQWtGO1FBQ2xGLE1BQU0sQ0FBQyxPQUFPLFFBQVEsS0FBSyxVQUFVLENBQUM7SUFDMUMsQ0FBQztJQUVELGdDQUFnQztJQUNoQyxvREFBb0Q7SUFDcEQsdUJBQXVCLFFBQWE7UUFDaEMsdUZBQXVGO1FBQ3ZGLE1BQU0sQ0FBQyxPQUFPLFFBQVEsS0FBSyxVQUFVLENBQUM7SUFDMUMsQ0FBQztJQUVELGdDQUFnQztJQUNoQyxvREFBb0Q7SUFDcEQsdUJBQXVCLFFBQWE7UUFDaEMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixLQUFLLGNBQVUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQzdCLEtBQUssY0FBVSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDN0IsU0FBUyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzFCLENBQUM7SUFDTCxDQUFDO0lBRUQsNEJBQTRCO0lBQzVCLDREQUE0RDtJQUU1RCx3QkFBd0I7SUFDeEIsZ0RBQWdEO0lBQ2hELG1CQUFtQixDQUFNLEVBQUUsQ0FBTTtRQUM3QixJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxxQ0FBcUM7SUFDckMscUVBQXFFO0lBRXJFLHFCQUF3QixHQUFnQjtRQUNwQyxJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQUMsTUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUMsWUFBWTtRQUM1RCxJQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQUMsTUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELGtDQUFrQztJQUNsQyx5REFBeUQ7SUFDekQsdUJBQTBCLFVBQTZCO1FBQ25ELE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFRCwrQkFBK0I7SUFDL0IsbURBQW1EO0lBQ25ELHNCQUF5QixRQUFxQjtRQUMxQyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQztJQUN4QyxDQUFDO0lBRUQsNENBQTRDO0lBQzVDLG9EQUFvRDtJQUNwRCx1QkFBMEIsUUFBcUI7UUFDM0MsSUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELDBEQUEwRDtJQUMxRCwwRkFBMEY7SUFFMUYsb0NBQW9DO0lBQ3BDLDZEQUE2RDtJQUM3RCxnQ0FBZ0MsQ0FBTTtRQUNsQyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEtBQUssaUJBQWlCLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRXJFLGlFQUFpRTtRQUNqRSwwRUFBMEU7UUFDMUUscUZBQXFGO1FBQ3JGLGdGQUFnRjtRQUNoRixrQ0FBa0M7UUFFbEMsd0ZBQXdGO1FBQ3hGLGdGQUFnRjtRQUNoRixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssaUJBQWlCLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRTlDLHlHQUF5RztRQUN6RyxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzlCLElBQU0sY0FBYyxHQUFHLFNBQVMsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JFLEVBQUUsQ0FBQyxDQUFDLGNBQWMsSUFBSSxJQUFJLElBQUksY0FBYyxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRWhGLGdGQUFnRjtRQUNoRixJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sV0FBVyxLQUFLLFVBQVUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFFcEQsaUZBQWlGO1FBQ2pGLEVBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRXBDLCtDQUErQztRQUMvQyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxpQkFBaUI7SUFDakI7UUFDSSxJQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBTSxhQUFhLEdBQVUsRUFBRSxDQUFDO1FBRWhDO1lBS0kscUJBQVksSUFBUyxFQUFFLE1BQVcsRUFBRSxRQUFpQztnQkFGN0QsV0FBTSxHQUFHLENBQUMsQ0FBQztnQkFHZixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQzlCLENBQUM7WUFDRCxtQ0FBWSxHQUFaLGNBQWlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQy9CLHNCQUFDLGNBQWMsQ0FBQyxHQUFoQixjQUFxQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuQywwQkFBSSxHQUFKO2dCQUNJLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDdEUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO3dCQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQztvQkFDakMsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDRixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2xCLENBQUM7b0JBQ0QsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7Z0JBQzFDLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFTLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDbkQsQ0FBQztZQUNELDJCQUFLLEdBQUwsVUFBTSxLQUFVO2dCQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7b0JBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDO2dCQUNqQyxDQUFDO2dCQUNELE1BQU0sS0FBSyxDQUFDO1lBQ2hCLENBQUM7WUFDRCw0QkFBTSxHQUFOLFVBQU8sS0FBUztnQkFDWixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO29CQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQztnQkFDakMsQ0FBQztnQkFDRCxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQVMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUMvQyxDQUFDO1lBQ0wsa0JBQUM7UUFBRCxDQUFDO1FBRUQsTUFBTTtZQUFDO2dCQUNLLFVBQUssR0FBUSxFQUFFLENBQUM7Z0JBQ2hCLFlBQU8sR0FBc0IsRUFBRSxDQUFDO2dCQUNoQyxjQUFTLEdBQUcsYUFBYSxDQUFDO2dCQUMxQixnQkFBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBb0Q3QixDQUFDO1lBbkRHLHNCQUFJLHFCQUFJO3FCQUFSLGNBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7O2VBQUE7WUFDeEMsaUJBQUcsR0FBSCxVQUFJLEdBQU0sSUFBYSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkUsaUJBQUcsR0FBSCxVQUFJLEdBQU07Z0JBQ04sSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUN4RCxDQUFDO1lBQ0QsaUJBQUcsR0FBSCxVQUFJLEdBQU0sRUFBRSxLQUFRO2dCQUNoQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFDRCxvQkFBTSxHQUFOLFVBQU8sR0FBTTtnQkFDVCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNiLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO29CQUMvQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsQ0FBQztvQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUN0QixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO3dCQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUMxQixDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1lBQ0QsbUJBQUssR0FBTDtnQkFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDMUIsQ0FBQztZQUNELGtCQUFJLEdBQUosY0FBUyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRSxvQkFBTSxHQUFOLGNBQVcsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEUscUJBQU8sR0FBUCxjQUFZLE1BQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLDJCQUFZLEdBQVosY0FBaUIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsY0FBQyxjQUFjLENBQUMsR0FBaEIsY0FBcUIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckMsbUJBQUssR0FBYixVQUFjLEdBQU0sRUFBRSxNQUFnQjtnQkFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ2hFLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztvQkFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzVCLENBQUM7WUFDTCxVQUFDO1FBQUQsQ0FBQyxJQUFDO1FBRUYsZ0JBQXNCLEdBQU0sRUFBRSxDQUFJO1lBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO1FBRUQsa0JBQXdCLENBQUksRUFBRSxLQUFRO1lBQ2xDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELGtCQUF3QixHQUFNLEVBQUUsS0FBUTtZQUNwQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFXLENBQUM7UUFDbEMsQ0FBQztJQUNMLENBQUM7SUFFRCxpQkFBaUI7SUFDakI7UUFDSSxNQUFNO1lBQUM7Z0JBQ0ssU0FBSSxHQUFHLElBQUksSUFBSSxFQUFZLENBQUM7WUFXeEMsQ0FBQztZQVZHLHNCQUFJLHFCQUFJO3FCQUFSLGNBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O2VBQUE7WUFDckMsaUJBQUcsR0FBSCxVQUFJLEtBQVEsSUFBYSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELGlCQUFHLEdBQUgsVUFBSSxLQUFRLElBQVksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25FLG9CQUFNLEdBQU4sVUFBTyxLQUFRLElBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxtQkFBSyxHQUFMLGNBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLGtCQUFJLEdBQUosY0FBUyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsb0JBQU0sR0FBTixjQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QyxxQkFBTyxHQUFQLGNBQVksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLDJCQUFZLEdBQVosY0FBaUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEMsY0FBQyxjQUFjLENBQUMsR0FBaEIsY0FBcUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUMsVUFBQztRQUFELENBQUMsSUFBQztJQUNOLENBQUM7SUFFRCxxQkFBcUI7SUFDckI7UUFDSSxJQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBVyxDQUFDO1FBQ3ZDLElBQU0sT0FBTyxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBQ2xDLE1BQU07WUFBQztnQkFDSyxTQUFJLEdBQUcsZUFBZSxFQUFFLENBQUM7WUFzQnJDLENBQUM7WUFyQkcscUJBQUcsR0FBSCxVQUFJLE1BQVM7Z0JBQ1QsSUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUksTUFBTSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkUsTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUN2RSxDQUFDO1lBQ0QscUJBQUcsR0FBSCxVQUFJLE1BQVM7Z0JBQ1QsSUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUksTUFBTSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkUsTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUMzRSxDQUFDO1lBQ0QscUJBQUcsR0FBSCxVQUFJLE1BQVMsRUFBRSxLQUFRO2dCQUNuQixJQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBSSxNQUFNLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDekIsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBQ0Qsd0JBQU0sR0FBTixVQUFPLE1BQVM7Z0JBQ1osSUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUksTUFBTSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkUsTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLEdBQUcsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNqRSxDQUFDO1lBQ0QsdUJBQUssR0FBTDtnQkFDSSxtRUFBbUU7Z0JBQ25FLElBQUksQ0FBQyxJQUFJLEdBQUcsZUFBZSxFQUFFLENBQUM7WUFDbEMsQ0FBQztZQUNMLGNBQUM7UUFBRCxDQUFDLElBQUM7UUFFRjtZQUNJLElBQUksR0FBVyxDQUFDO1lBQ2hCO2dCQUFHLEdBQUcsR0FBRyxhQUFhLEdBQUcsVUFBVSxFQUFFLENBQUM7bUJBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakIsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFJRCxpQ0FBb0MsTUFBUyxFQUFFLE1BQWU7WUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO29CQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzdFLENBQUM7WUFDRCxNQUFNLENBQU8sTUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCx5QkFBeUIsTUFBa0IsRUFBRSxJQUFZO1lBQ3JELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQztnQkFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7WUFDcEUsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBRUQsd0JBQXdCLElBQVk7WUFDaEMsRUFBRSxDQUFDLENBQUMsT0FBTyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFlLENBQUM7Z0JBQ3JHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sUUFBUSxLQUFLLFdBQVcsQ0FBQztvQkFBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBZSxDQUFDO2dCQUN6RyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFDRCxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFFRDtZQUNJLElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2QyxrQ0FBa0M7WUFDbEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNoQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQztnQkFDaEQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksTUFBTSxLQUFLLENBQUMsQ0FBQztvQkFBQyxNQUFNLElBQUksR0FBRyxDQUFDO2dCQUNoRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7Z0JBQzdCLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzlDLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7SUFDTCxDQUFDO0lBRUQsa0ZBQWtGO0lBQ2xGLHdCQUEyQixHQUFNO1FBQ3ZCLEdBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQzFCLE9BQWEsR0FBSSxDQUFDLEVBQUUsQ0FBQztRQUNyQixNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixDQUFDLFVBQVUsUUFBYTtRQUNwQixFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsQ0FBQyxPQUFPLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMxQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEdBQUcsQ0FBQyxDQUFDLElBQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBUyxPQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVDLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDRixRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUMvQixDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQ0UsT0FBTyxNQUFNLEtBQUssV0FBVyxHQUFHLE1BQU07UUFDbEMsT0FBTyxJQUFJLEtBQUssV0FBVyxHQUFHLElBQUk7WUFDOUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QyxDQUFDLEVBcHFEUyxPQUFPLEtBQVAsT0FBTyxRQW9xRGhCIiwiZmlsZSI6IjEuNTY2Zjg2M2QwNDhiMGQwNGFlYWYuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKEMpIE1pY3Jvc29mdC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbm5hbWVzcGFjZSBSZWZsZWN0IHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIE1ldGFkYXRhIFByb3Bvc2FsXHJcbiAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhL1xyXG5cclxuICAgIHR5cGUgSGFzaE1hcDxWPiA9IFJlY29yZDxzdHJpbmcsIFY+O1xyXG5cclxuICAgIGludGVyZmFjZSBCdWZmZXJMaWtlIHtcclxuICAgICAgICBbb2Zmc2V0OiBudW1iZXJdOiBudW1iZXI7XHJcbiAgICAgICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZSBJdGVyYXRvclJlc3VsdDxUPiA9IHsgdmFsdWU6IFQsIGRvbmU6IGZhbHNlIH0gfCB7IHZhbHVlOiBuZXZlciwgZG9uZTogdHJ1ZSB9O1xyXG5cclxuICAgIGludGVyZmFjZSBJdGVyYXRvcjxUPiB7XHJcbiAgICAgICAgbmV4dCh2YWx1ZT86IGFueSk6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xyXG4gICAgICAgIHRocm93Pyh2YWx1ZTogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XHJcbiAgICAgICAgcmV0dXJuPyh2YWx1ZT86IFQpOiBJdGVyYXRvclJlc3VsdDxUPjtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgSXRlcmFibGU8VD4ge1xyXG4gICAgICAgIFwiQEBpdGVyYXRvclwiKCk6IEl0ZXJhdG9yPFQ+O1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBJdGVyYWJsZUl0ZXJhdG9yPFQ+IGV4dGVuZHMgSXRlcmF0b3I8VD4ge1xyXG4gICAgICAgIFwiQEBpdGVyYXRvclwiKCk6IEl0ZXJhYmxlSXRlcmF0b3I8VD47XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIE1hcDxLLCBWPiBleHRlbmRzIEl0ZXJhYmxlPFtLLCBWXT4ge1xyXG4gICAgICAgIHNpemU6IG51bWJlcjtcclxuICAgICAgICBoYXMoa2V5OiBLKTogYm9vbGVhbjtcclxuICAgICAgICBnZXQoa2V5OiBLKTogVjtcclxuICAgICAgICBzZXQoa2V5OiBLLCB2YWx1ZT86IFYpOiB0aGlzO1xyXG4gICAgICAgIGRlbGV0ZShrZXk6IEspOiBib29sZWFuO1xyXG4gICAgICAgIGNsZWFyKCk6IHZvaWQ7XHJcbiAgICAgICAga2V5cygpOiBJdGVyYWJsZUl0ZXJhdG9yPEs+O1xyXG4gICAgICAgIHZhbHVlcygpOiBJdGVyYWJsZUl0ZXJhdG9yPFY+O1xyXG4gICAgICAgIGVudHJpZXMoKTogSXRlcmFibGVJdGVyYXRvcjxbSywgVl0+O1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBNYXBDb25zdHJ1Y3RvciB7XHJcbiAgICAgICAgbmV3ICgpOiBNYXA8YW55LCBhbnk+O1xyXG4gICAgICAgIG5ldyA8SywgVj4oKTogTWFwPEssIFY+O1xyXG4gICAgICAgIHByb3RvdHlwZTogTWFwPGFueSwgYW55PjtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgU2V0PFQ+IGV4dGVuZHMgSXRlcmFibGU8VD4ge1xyXG4gICAgICAgIHNpemU6IG51bWJlcjtcclxuICAgICAgICBoYXModmFsdWU6IFQpOiBib29sZWFuO1xyXG4gICAgICAgIGFkZCh2YWx1ZTogVCk6IHRoaXM7XHJcbiAgICAgICAgZGVsZXRlKHZhbHVlOiBUKTogYm9vbGVhbjtcclxuICAgICAgICBjbGVhcigpOiB2b2lkO1xyXG4gICAgICAgIGtleXMoKTogSXRlcmFibGVJdGVyYXRvcjxUPjtcclxuICAgICAgICB2YWx1ZXMoKTogSXRlcmFibGVJdGVyYXRvcjxUPjtcclxuICAgICAgICBlbnRyaWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W1QsIFRdPjtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgU2V0Q29uc3RydWN0b3Ige1xyXG4gICAgICAgIG5ldyAoKTogU2V0PGFueT47XHJcbiAgICAgICAgbmV3IDxUPigpOiBTZXQ8VD47XHJcbiAgICAgICAgcHJvdG90eXBlOiBTZXQ8YW55PjtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgV2Vha01hcDxLLCBWPiB7XHJcbiAgICAgICAgY2xlYXIoKTogdm9pZDtcclxuICAgICAgICBkZWxldGUoa2V5OiBLKTogYm9vbGVhbjtcclxuICAgICAgICBnZXQoa2V5OiBLKTogVjtcclxuICAgICAgICBoYXMoa2V5OiBLKTogYm9vbGVhbjtcclxuICAgICAgICBzZXQoa2V5OiBLLCB2YWx1ZT86IFYpOiBXZWFrTWFwPEssIFY+O1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBXZWFrTWFwQ29uc3RydWN0b3Ige1xyXG4gICAgICAgIG5ldyAoKTogV2Vha01hcDxhbnksIGFueT47XHJcbiAgICAgICAgbmV3IDxLLCBWPigpOiBXZWFrTWFwPEssIFY+O1xyXG4gICAgICAgIHByb3RvdHlwZTogV2Vha01hcDxhbnksIGFueT47XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZSBNZW1iZXJEZWNvcmF0b3IgPSA8VD4odGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIGRlc2NyaXB0b3I/OiBUeXBlZFByb3BlcnR5RGVzY3JpcHRvcjxUPikgPT4gVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3I8VD4gfCB2b2lkO1xyXG5cclxuICAgIGRlY2xhcmUgY29uc3QgU3ltYm9sOiB7IGl0ZXJhdG9yOiBzeW1ib2wsIHRvUHJpbWl0aXZlOiBzeW1ib2wgfTtcclxuICAgIGRlY2xhcmUgY29uc3QgU2V0OiBTZXRDb25zdHJ1Y3RvcjtcclxuICAgIGRlY2xhcmUgY29uc3QgV2Vha01hcDogV2Vha01hcENvbnN0cnVjdG9yO1xyXG4gICAgZGVjbGFyZSBjb25zdCBNYXA6IE1hcENvbnN0cnVjdG9yO1xyXG4gICAgZGVjbGFyZSBjb25zdCBnbG9iYWw6IGFueTtcclxuICAgIGRlY2xhcmUgY29uc3QgY3J5cHRvOiBDcnlwdG87XHJcbiAgICBkZWNsYXJlIGNvbnN0IG1zQ3J5cHRvOiBDcnlwdG87XHJcbiAgICBkZWNsYXJlIGNvbnN0IHByb2Nlc3M6IGFueTtcclxuXHJcbiAgICBjb25zdCBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xyXG5cclxuICAgIC8vIGZlYXR1cmUgdGVzdCBmb3IgU3ltYm9sIHN1cHBvcnRcclxuICAgIGNvbnN0IHN1cHBvcnRzU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiO1xyXG4gICAgY29uc3QgdG9QcmltaXRpdmVTeW1ib2wgPSBzdXBwb3J0c1N5bWJvbCAmJiB0eXBlb2YgU3ltYm9sLnRvUHJpbWl0aXZlICE9PSBcInVuZGVmaW5lZFwiID8gU3ltYm9sLnRvUHJpbWl0aXZlIDogXCJAQHRvUHJpbWl0aXZlXCI7XHJcbiAgICBjb25zdCBpdGVyYXRvclN5bWJvbCA9IHN1cHBvcnRzU3ltYm9sICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgIT09IFwidW5kZWZpbmVkXCIgPyBTeW1ib2wuaXRlcmF0b3IgOiBcIkBAaXRlcmF0b3JcIjtcclxuXHJcbiAgICBuYW1lc3BhY2UgSGFzaE1hcCB7XHJcbiAgICAgICAgY29uc3Qgc3VwcG9ydHNDcmVhdGUgPSB0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gXCJmdW5jdGlvblwiOyAvLyBmZWF0dXJlIHRlc3QgZm9yIE9iamVjdC5jcmVhdGUgc3VwcG9ydFxyXG4gICAgICAgIGNvbnN0IHN1cHBvcnRzUHJvdG8gPSB7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5OyAvLyBmZWF0dXJlIHRlc3QgZm9yIF9fcHJvdG9fXyBzdXBwb3J0XHJcbiAgICAgICAgY29uc3QgZG93bkxldmVsID0gIXN1cHBvcnRzQ3JlYXRlICYmICFzdXBwb3J0c1Byb3RvO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgYW4gb2JqZWN0IGluIGRpY3Rpb25hcnkgbW9kZSAoYS5rLmEuIFwic2xvd1wiIG1vZGUgaW4gdjgpXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IGNyZWF0ZSA9IHN1cHBvcnRzQ3JlYXRlXHJcbiAgICAgICAgICAgID8gPFY+KCkgPT4gTWFrZURpY3Rpb25hcnkoT2JqZWN0LmNyZWF0ZShudWxsKSBhcyBIYXNoTWFwPFY+KVxyXG4gICAgICAgICAgICA6IHN1cHBvcnRzUHJvdG9cclxuICAgICAgICAgICAgICAgID8gPFY+KCkgPT4gTWFrZURpY3Rpb25hcnkoeyBfX3Byb3RvX186IG51bGwgYXMgYW55IH0gYXMgSGFzaE1hcDxWPilcclxuICAgICAgICAgICAgICAgIDogPFY+KCkgPT4gTWFrZURpY3Rpb25hcnkoe30gYXMgSGFzaE1hcDxWPik7XHJcblxyXG4gICAgICAgIGV4cG9ydCBjb25zdCBoYXMgPSBkb3duTGV2ZWxcclxuICAgICAgICAgICAgPyA8Vj4obWFwOiBIYXNoTWFwPFY+LCBrZXk6IHN0cmluZyB8IG51bWJlciB8IHN5bWJvbCkgPT4gaGFzT3duLmNhbGwobWFwLCBrZXkpXHJcbiAgICAgICAgICAgIDogPFY+KG1hcDogSGFzaE1hcDxWPiwga2V5OiBzdHJpbmcgfCBudW1iZXIgfCBzeW1ib2wpID0+IGtleSBpbiBtYXA7XHJcblxyXG4gICAgICAgIGV4cG9ydCBjb25zdCBnZXQgPSBkb3duTGV2ZWxcclxuICAgICAgICAgICAgPyA8Vj4obWFwOiBIYXNoTWFwPFY+LCBrZXk6IHN0cmluZyB8IG51bWJlciB8IHN5bWJvbCk6IFYgfCB1bmRlZmluZWQgPT4gaGFzT3duLmNhbGwobWFwLCBrZXkpID8gbWFwW2tleV0gOiB1bmRlZmluZWRcclxuICAgICAgICAgICAgOiA8Vj4obWFwOiBIYXNoTWFwPFY+LCBrZXk6IHN0cmluZyB8IG51bWJlciB8IHN5bWJvbCk6IFYgfCB1bmRlZmluZWQgPT4gbWFwW2tleV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTG9hZCBnbG9iYWwgb3Igc2hpbSB2ZXJzaW9ucyBvZiBNYXAsIFNldCwgYW5kIFdlYWtNYXBcclxuICAgIGNvbnN0IGZ1bmN0aW9uUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKEZ1bmN0aW9uKTtcclxuICAgIGNvbnN0IHVzZVBvbHlmaWxsID0gdHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnZbXCJSRUZMRUNUX01FVEFEQVRBX1VTRV9NQVBfUE9MWUZJTExcIl0gPT09IFwidHJ1ZVwiO1xyXG4gICAgY29uc3QgX01hcDogdHlwZW9mIE1hcCA9ICF1c2VQb2x5ZmlsbCAmJiB0eXBlb2YgTWFwID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIE1hcC5wcm90b3R5cGUuZW50cmllcyA9PT0gXCJmdW5jdGlvblwiID8gTWFwIDogQ3JlYXRlTWFwUG9seWZpbGwoKTtcclxuICAgIGNvbnN0IF9TZXQ6IHR5cGVvZiBTZXQgPSAhdXNlUG9seWZpbGwgJiYgdHlwZW9mIFNldCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTZXQucHJvdG90eXBlLmVudHJpZXMgPT09IFwiZnVuY3Rpb25cIiA/IFNldCA6IENyZWF0ZVNldFBvbHlmaWxsKCk7XHJcbiAgICBjb25zdCBfV2Vha01hcDogdHlwZW9mIFdlYWtNYXAgPSAhdXNlUG9seWZpbGwgJiYgdHlwZW9mIFdlYWtNYXAgPT09IFwiZnVuY3Rpb25cIiA/IFdlYWtNYXAgOiBDcmVhdGVXZWFrTWFwUG9seWZpbGwoKTtcclxuXHJcbiAgICAvLyBbW01ldGFkYXRhXV0gaW50ZXJuYWwgc2xvdFxyXG4gICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jb3JkaW5hcnktb2JqZWN0LWludGVybmFsLW1ldGhvZHMtYW5kLWludGVybmFsLXNsb3RzXHJcbiAgICBjb25zdCBNZXRhZGF0YSA9IG5ldyBfV2Vha01hcDxhbnksIE1hcDxzdHJpbmcgfCBzeW1ib2wgfCB1bmRlZmluZWQsIE1hcDxhbnksIGFueT4+PigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIEFwcGxpZXMgYSBzZXQgb2YgZGVjb3JhdG9ycyB0byBhIHRhcmdldCBvYmplY3QuXHJcbiAgICAgICogQHBhcmFtIGRlY29yYXRvcnMgQW4gYXJyYXkgb2YgZGVjb3JhdG9ycy5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0LlxyXG4gICAgICAqIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgYXBwbHlpbmcgdGhlIHByb3ZpZGVkIGRlY29yYXRvcnMuXHJcbiAgICAgICogQHJlbWFya3MgRGVjb3JhdG9ycyBhcmUgYXBwbGllZCBpbiByZXZlcnNlIG9yZGVyIG9mIHRoZWlyIHBvc2l0aW9ucyBpbiB0aGUgYXJyYXkuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHsgfVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXHJcbiAgICAgICogICAgIEV4YW1wbGUgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnNBcnJheSwgRXhhbXBsZSk7XHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkZWNvcmF0b3JzOiBDbGFzc0RlY29yYXRvcltdLCB0YXJnZXQ6IEZ1bmN0aW9uKTogRnVuY3Rpb247XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICogQXBwbGllcyBhIHNldCBvZiBkZWNvcmF0b3JzIHRvIGEgcHJvcGVydHkgb2YgYSB0YXJnZXQgb2JqZWN0LlxyXG4gICAgICAqIEBwYXJhbSBkZWNvcmF0b3JzIEFuIGFycmF5IG9mIGRlY29yYXRvcnMuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdC5cclxuICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgVGhlIHByb3BlcnR5IGtleSB0byBkZWNvcmF0ZS5cclxuICAgICAgKiBAcGFyYW0gYXR0cmlidXRlcyBBIHByb3BlcnR5IGRlc2NyaXB0b3IuXHJcbiAgICAgICogQHJlbWFya3MgRGVjb3JhdG9ycyBhcmUgYXBwbGllZCBpbiByZXZlcnNlIG9yZGVyLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XHJcbiAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZCgpIHsgfVxyXG4gICAgICAqICAgICAgICAgbWV0aG9kKCkgeyB9XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIixcclxuICAgICAgKiAgICAgICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiLFxyXG4gICAgICAqICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIikpKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiLFxyXG4gICAgICAqICAgICAgICAgUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzQXJyYXksIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiLFxyXG4gICAgICAqICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpKSk7XHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkZWNvcmF0b3JzOiAoUHJvcGVydHlEZWNvcmF0b3IgfCBNZXRob2REZWNvcmF0b3IpW10sIHRhcmdldDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sLCBhdHRyaWJ1dGVzPzogUHJvcGVydHlEZXNjcmlwdG9yIHwgbnVsbCk6IFByb3BlcnR5RGVzY3JpcHRvciB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBBcHBsaWVzIGEgc2V0IG9mIGRlY29yYXRvcnMgdG8gYSBwcm9wZXJ0eSBvZiBhIHRhcmdldCBvYmplY3QuXHJcbiAgICAgICogQHBhcmFtIGRlY29yYXRvcnMgQW4gYXJyYXkgb2YgZGVjb3JhdG9ycy5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0LlxyXG4gICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSBUaGUgcHJvcGVydHkga2V5IHRvIGRlY29yYXRlLlxyXG4gICAgICAqIEBwYXJhbSBhdHRyaWJ1dGVzIEEgcHJvcGVydHkgZGVzY3JpcHRvci5cclxuICAgICAgKiBAcmVtYXJrcyBEZWNvcmF0b3JzIGFyZSBhcHBsaWVkIGluIHJldmVyc2Ugb3JkZXIuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcclxuICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xyXG4gICAgICAqXHJcbiAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKCkgeyB9XHJcbiAgICAgICogICAgICAgICBtZXRob2QoKSB7IH1cclxuICAgICAgKiAgICAgfVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzQXJyYXksIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzQXJyYXksIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiLFxyXG4gICAgICAqICAgICAgICAgUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzQXJyYXksIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIsXHJcbiAgICAgICogICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKSkpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIsXHJcbiAgICAgICogICAgICAgICBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnNBcnJheSwgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIsXHJcbiAgICAgICogICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIikpKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlKGRlY29yYXRvcnM6IChQcm9wZXJ0eURlY29yYXRvciB8IE1ldGhvZERlY29yYXRvcilbXSwgdGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIGF0dHJpYnV0ZXM6IFByb3BlcnR5RGVzY3JpcHRvcik6IFByb3BlcnR5RGVzY3JpcHRvcjtcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBBcHBsaWVzIGEgc2V0IG9mIGRlY29yYXRvcnMgdG8gYSBwcm9wZXJ0eSBvZiBhIHRhcmdldCBvYmplY3QuXHJcbiAgICAgICogQHBhcmFtIGRlY29yYXRvcnMgQW4gYXJyYXkgb2YgZGVjb3JhdG9ycy5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0LlxyXG4gICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgdG8gZGVjb3JhdGUuXHJcbiAgICAgICogQHBhcmFtIGF0dHJpYnV0ZXMgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgdGhlIHRhcmdldCBrZXkuXHJcbiAgICAgICogQHJlbWFya3MgRGVjb3JhdG9ycyBhcmUgYXBwbGllZCBpbiByZXZlcnNlIG9yZGVyLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XHJcbiAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XHJcbiAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcclxuICAgICAgKiAgICAgRXhhbXBsZSA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIixcclxuICAgICAgKiAgICAgICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiLFxyXG4gICAgICAqICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIikpKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiLFxyXG4gICAgICAqICAgICAgICAgUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzQXJyYXksIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiLFxyXG4gICAgICAqICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpKSk7XHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkZWNvcmF0b3JzOiAoQ2xhc3NEZWNvcmF0b3IgfCBNZW1iZXJEZWNvcmF0b3IpW10sIHRhcmdldDogYW55LCBwcm9wZXJ0eUtleT86IHN0cmluZyB8IHN5bWJvbCwgYXR0cmlidXRlcz86IFByb3BlcnR5RGVzY3JpcHRvciB8IG51bGwpOiBQcm9wZXJ0eURlc2NyaXB0b3IgfCBGdW5jdGlvbiB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpIHtcclxuICAgICAgICAgICAgaWYgKCFJc0FycmF5KGRlY29yYXRvcnMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KGF0dHJpYnV0ZXMpICYmICFJc1VuZGVmaW5lZChhdHRyaWJ1dGVzKSAmJiAhSXNOdWxsKGF0dHJpYnV0ZXMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcbiAgICAgICAgICAgIGlmIChJc051bGwoYXR0cmlidXRlcykpIGF0dHJpYnV0ZXMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHByb3BlcnR5S2V5ID0gVG9Qcm9wZXJ0eUtleShwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBEZWNvcmF0ZVByb3BlcnR5KDxNZW1iZXJEZWNvcmF0b3JbXT5kZWNvcmF0b3JzLCB0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghSXNBcnJheShkZWNvcmF0b3JzKSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgICAgICBpZiAoIUlzQ29uc3RydWN0b3IodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gRGVjb3JhdGVDb25zdHJ1Y3Rvcig8Q2xhc3NEZWNvcmF0b3JbXT5kZWNvcmF0b3JzLCA8RnVuY3Rpb24+dGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNC4xLjIgUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSlcclxuICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI3JlZmxlY3QubWV0YWRhdGFcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBBIGRlZmF1bHQgbWV0YWRhdGEgZGVjb3JhdG9yIGZhY3RvcnkgdGhhdCBjYW4gYmUgdXNlZCBvbiBhIGNsYXNzLCBjbGFzcyBtZW1iZXIsIG9yIHBhcmFtZXRlci5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgVGhlIGtleSBmb3IgdGhlIG1ldGFkYXRhIGVudHJ5LlxyXG4gICAgICAqIEBwYXJhbSBtZXRhZGF0YVZhbHVlIFRoZSB2YWx1ZSBmb3IgdGhlIG1ldGFkYXRhIGVudHJ5LlxyXG4gICAgICAqIEByZXR1cm5zIEEgZGVjb3JhdG9yIGZ1bmN0aW9uLlxyXG4gICAgICAqIEByZW1hcmtzXHJcbiAgICAgICogSWYgYG1ldGFkYXRhS2V5YCBpcyBhbHJlYWR5IGRlZmluZWQgZm9yIHRoZSB0YXJnZXQgYW5kIHRhcmdldCBrZXksIHRoZVxyXG4gICAgICAqIG1ldGFkYXRhVmFsdWUgZm9yIHRoYXQga2V5IHdpbGwgYmUgb3ZlcndyaXR0ZW4uXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxyXG4gICAgICAqICAgICBAUmVmbGVjdC5tZXRhZGF0YShrZXksIHZhbHVlKVxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgfVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvciwgVHlwZVNjcmlwdCBvbmx5KVxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgICAgIEBSZWZsZWN0Lm1ldGFkYXRhKGtleSwgdmFsdWUpXHJcbiAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljUHJvcGVydHk7XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlLCBUeXBlU2NyaXB0IG9ubHkpXHJcbiAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xyXG4gICAgICAqICAgICAgICAgQFJlZmxlY3QubWV0YWRhdGEoa2V5LCB2YWx1ZSlcclxuICAgICAgKiAgICAgICAgIHByb3BlcnR5O1xyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgICAgICBAUmVmbGVjdC5tZXRhZGF0YShrZXksIHZhbHVlKVxyXG4gICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZCgpIHsgfVxyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xyXG4gICAgICAqICAgICAgICAgQFJlZmxlY3QubWV0YWRhdGEoa2V5LCB2YWx1ZSlcclxuICAgICAgKiAgICAgICAgIG1ldGhvZCgpIHsgfVxyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtZXRhZGF0YShtZXRhZGF0YUtleTogYW55LCBtZXRhZGF0YVZhbHVlOiBhbnkpIHtcclxuICAgICAgICBmdW5jdGlvbiBkZWNvcmF0b3IodGFyZ2V0OiBGdW5jdGlvbik6IHZvaWQ7XHJcbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdG9yKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKTogdm9pZDtcclxuICAgICAgICBmdW5jdGlvbiBkZWNvcmF0b3IodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5Pzogc3RyaW5nIHwgc3ltYm9sKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSAmJiAhSXNQcm9wZXJ0eUtleShwcm9wZXJ0eUtleSkpIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuICAgICAgICAgICAgT3JkaW5hcnlEZWZpbmVPd25NZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZWNvcmF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNC4xLjMgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSwgdGFyZ2V0IFssIHByb3BlcnR5S2V5XSlcclxuICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI3JlZmxlY3QuZGVmaW5lbWV0YWRhdGFcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBEZWZpbmUgYSB1bmlxdWUgbWV0YWRhdGEgZW50cnkgb24gdGhlIHRhcmdldC5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIG1ldGFkYXRhVmFsdWUgQSB2YWx1ZSB0aGF0IGNvbnRhaW5zIGF0dGFjaGVkIG1ldGFkYXRhLlxyXG4gICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdG8gZGVmaW5lIG1ldGFkYXRhLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxyXG4gICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZSk7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gZGVjb3JhdG9yIGZhY3RvcnkgYXMgbWV0YWRhdGEtcHJvZHVjaW5nIGFubm90YXRpb24uXHJcbiAgICAgICogICAgIGZ1bmN0aW9uIE15QW5ub3RhdGlvbihvcHRpb25zKTogQ2xhc3NEZWNvcmF0b3Ige1xyXG4gICAgICAqICAgICAgICAgcmV0dXJuIHRhcmdldCA9PiBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgdGFyZ2V0KTtcclxuICAgICAgKiAgICAgfVxyXG4gICAgICAqXHJcbiAgICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVmaW5lTWV0YWRhdGEobWV0YWRhdGFLZXk6IGFueSwgbWV0YWRhdGFWYWx1ZTogYW55LCB0YXJnZXQ6IGFueSk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICogRGVmaW5lIGEgdW5pcXVlIG1ldGFkYXRhIGVudHJ5IG9uIHRoZSB0YXJnZXQuXHJcbiAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IEEga2V5IHVzZWQgdG8gc3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhLlxyXG4gICAgICAqIEBwYXJhbSBtZXRhZGF0YVZhbHVlIEEgdmFsdWUgdGhhdCBjb250YWlucyBhdHRhY2hlZCBtZXRhZGF0YS5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRvIGRlZmluZSBtZXRhZGF0YS5cclxuICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cclxuICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xyXG4gICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxyXG4gICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xyXG4gICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBOdW1iZXIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIE51bWJlciwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIE51bWJlciwgRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBOdW1iZXIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBkZWNvcmF0b3IgZmFjdG9yeSBhcyBtZXRhZGF0YS1wcm9kdWNpbmcgYW5ub3RhdGlvbi5cclxuICAgICAgKiAgICAgZnVuY3Rpb24gTXlBbm5vdGF0aW9uKG9wdGlvbnMpOiBQcm9wZXJ0eURlY29yYXRvciB7XHJcbiAgICAgICogICAgICAgICByZXR1cm4gKHRhcmdldCwga2V5KSA9PiBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgdGFyZ2V0LCBrZXkpO1xyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVNZXRhZGF0YShtZXRhZGF0YUtleTogYW55LCBtZXRhZGF0YVZhbHVlOiBhbnksIHRhcmdldDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBEZWZpbmUgYSB1bmlxdWUgbWV0YWRhdGEgZW50cnkgb24gdGhlIHRhcmdldC5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIG1ldGFkYXRhVmFsdWUgQSB2YWx1ZSB0aGF0IGNvbnRhaW5zIGF0dGFjaGVkIG1ldGFkYXRhLlxyXG4gICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdG8gZGVmaW5lIG1ldGFkYXRhLlxyXG4gICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcclxuICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xyXG4gICAgICAqXHJcbiAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cclxuICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxyXG4gICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZSk7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIG9wdGlvbnMsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIGRlY29yYXRvciBmYWN0b3J5IGFzIG1ldGFkYXRhLXByb2R1Y2luZyBhbm5vdGF0aW9uLlxyXG4gICAgICAqICAgICBmdW5jdGlvbiBNeUFubm90YXRpb24ob3B0aW9ucyk6IERlY29yYXRvciB7XHJcbiAgICAgICogICAgICAgICByZXR1cm4gKHRhcmdldCwga2V5PykgPT4gUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIG9wdGlvbnMsIHRhcmdldCwga2V5KTtcclxuICAgICAgKiAgICAgfVxyXG4gICAgICAqXHJcbiAgICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVmaW5lTWV0YWRhdGEobWV0YWRhdGFLZXk6IGFueSwgbWV0YWRhdGFWYWx1ZTogYW55LCB0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk/OiBzdHJpbmcgfCBzeW1ib2wpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSkgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcclxuICAgICAgICByZXR1cm4gT3JkaW5hcnlEZWZpbmVPd25NZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNC4xLjQgUmVmbGVjdC5oYXNNZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0IFssIHByb3BlcnR5S2V5XSlcclxuICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI3JlZmxlY3QuaGFzbWV0YWRhdGFcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBHZXRzIGEgdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSB0YXJnZXQgb2JqZWN0IG9yIGl0cyBwcm90b3R5cGUgY2hhaW4gaGFzIHRoZSBwcm92aWRlZCBtZXRhZGF0YSBrZXkgZGVmaW5lZC5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1ldGFkYXRhIGtleSB3YXMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdCBvciBpdHMgcHJvdG90eXBlIGNoYWluOyBvdGhlcndpc2UsIGBmYWxzZWAuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgfVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGhhc01ldGFkYXRhKG1ldGFkYXRhS2V5OiBhbnksIHRhcmdldDogYW55KTogYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBHZXRzIGEgdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSB0YXJnZXQgb2JqZWN0IG9yIGl0cyBwcm90b3R5cGUgY2hhaW4gaGFzIHRoZSBwcm92aWRlZCBtZXRhZGF0YSBrZXkgZGVmaW5lZC5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cclxuICAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1ldGFkYXRhIGtleSB3YXMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdCBvciBpdHMgcHJvdG90eXBlIGNoYWluOyBvdGhlcndpc2UsIGBmYWxzZWAuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcclxuICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xyXG4gICAgICAqXHJcbiAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaGFzTWV0YWRhdGEobWV0YWRhdGFLZXk6IGFueSwgdGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIEdldHMgYSB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIHRhcmdldCBvYmplY3Qgb3IgaXRzIHByb3RvdHlwZSBjaGFpbiBoYXMgdGhlIHByb3ZpZGVkIG1ldGFkYXRhIGtleSBkZWZpbmVkLlxyXG4gICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxyXG4gICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXHJcbiAgICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBtZXRhZGF0YSBrZXkgd2FzIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3Qgb3IgaXRzIHByb3RvdHlwZSBjaGFpbjsgb3RoZXJ3aXNlLCBgZmFsc2VgLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XHJcbiAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XHJcbiAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGhhc01ldGFkYXRhKG1ldGFkYXRhS2V5OiBhbnksIHRhcmdldDogYW55LCBwcm9wZXJ0eUtleT86IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKSBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xyXG4gICAgICAgIHJldHVybiBPcmRpbmFyeUhhc01ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA0LjEuNSBSZWZsZWN0Lmhhc093bk1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQgWywgcHJvcGVydHlLZXldKVxyXG4gICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jcmVmbGVjdC1oYXNvd25tZXRhZGF0YVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIEdldHMgYSB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIHRhcmdldCBvYmplY3QgaGFzIHRoZSBwcm92aWRlZCBtZXRhZGF0YSBrZXkgZGVmaW5lZC5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1ldGFkYXRhIGtleSB3YXMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdDsgb3RoZXJ3aXNlLCBgZmFsc2VgLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc093bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSk7XHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBoYXNPd25NZXRhZGF0YShtZXRhZGF0YUtleTogYW55LCB0YXJnZXQ6IGFueSk6IGJvb2xlYW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICogR2V0cyBhIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgdGFyZ2V0IG9iamVjdCBoYXMgdGhlIHByb3ZpZGVkIG1ldGFkYXRhIGtleSBkZWZpbmVkLlxyXG4gICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxyXG4gICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxyXG4gICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbWV0YWRhdGEga2V5IHdhcyBkZWZpbmVkIG9uIHRoZSB0YXJnZXQgb2JqZWN0OyBvdGhlcndpc2UsIGBmYWxzZWAuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcclxuICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xyXG4gICAgICAqXHJcbiAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc093bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc093bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc093bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaGFzT3duTWV0YWRhdGEobWV0YWRhdGFLZXk6IGFueSwgdGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIEdldHMgYSB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIHRhcmdldCBvYmplY3QgaGFzIHRoZSBwcm92aWRlZCBtZXRhZGF0YSBrZXkgZGVmaW5lZC5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxyXG4gICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbWV0YWRhdGEga2V5IHdhcyBkZWZpbmVkIG9uIHRoZSB0YXJnZXQgb2JqZWN0OyBvdGhlcndpc2UsIGBmYWxzZWAuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcclxuICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xyXG4gICAgICAqXHJcbiAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cclxuICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc093bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSk7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc093bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc093bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc093bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaGFzT3duTWV0YWRhdGEobWV0YWRhdGFLZXk6IGFueSwgdGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5Pzogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcbiAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpIHByb3BlcnR5S2V5ID0gVG9Qcm9wZXJ0eUtleShwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgcmV0dXJuIE9yZGluYXJ5SGFzT3duTWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDQuMS42IFJlZmxlY3QuZ2V0TWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCBbLCBwcm9wZXJ0eUtleV0pXHJcbiAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNyZWZsZWN0LWdldG1ldGFkYXRhXHJcblxyXG4gICAgLyoqXHJcbiAgICAgICogR2V0cyB0aGUgbWV0YWRhdGEgdmFsdWUgZm9yIHRoZSBwcm92aWRlZCBtZXRhZGF0YSBrZXkgb24gdGhlIHRhcmdldCBvYmplY3Qgb3IgaXRzIHByb3RvdHlwZSBjaGFpbi5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcmV0dXJucyBUaGUgbWV0YWRhdGEgdmFsdWUgZm9yIHRoZSBtZXRhZGF0YSBrZXkgaWYgZm91bmQ7IG90aGVyd2lzZSwgYHVuZGVmaW5lZGAuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgfVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhKG1ldGFkYXRhS2V5OiBhbnksIHRhcmdldDogYW55KTogYW55O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIEdldHMgdGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgcHJvdmlkZWQgbWV0YWRhdGEga2V5IG9uIHRoZSB0YXJnZXQgb2JqZWN0IG9yIGl0cyBwcm90b3R5cGUgY2hhaW4uXHJcbiAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IEEga2V5IHVzZWQgdG8gc3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhLlxyXG4gICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdGhlIG1ldGFkYXRhIGlzIGRlZmluZWQuXHJcbiAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXHJcbiAgICAgICogQHJldHVybnMgVGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgbWV0YWRhdGEga2V5IGlmIGZvdW5kOyBvdGhlcndpc2UsIGB1bmRlZmluZWRgLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XHJcbiAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cclxuICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cclxuICAgICAgKiAgICAgfVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhKG1ldGFkYXRhS2V5OiBhbnksIHRhcmdldDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKTogYW55O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIEdldHMgdGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgcHJvdmlkZWQgbWV0YWRhdGEga2V5IG9uIHRoZSB0YXJnZXQgb2JqZWN0IG9yIGl0cyBwcm90b3R5cGUgY2hhaW4uXHJcbiAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IEEga2V5IHVzZWQgdG8gc3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhLlxyXG4gICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdGhlIG1ldGFkYXRhIGlzIGRlZmluZWQuXHJcbiAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cclxuICAgICAgKiBAcmV0dXJucyBUaGUgbWV0YWRhdGEgdmFsdWUgZm9yIHRoZSBtZXRhZGF0YSBrZXkgaWYgZm91bmQ7IG90aGVyd2lzZSwgYHVuZGVmaW5lZGAuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcclxuICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xyXG4gICAgICAqXHJcbiAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cclxuICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSk7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0TWV0YWRhdGEobWV0YWRhdGFLZXk6IGFueSwgdGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5Pzogc3RyaW5nIHwgc3ltYm9sKTogYW55IHtcclxuICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSkgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcclxuICAgICAgICByZXR1cm4gT3JkaW5hcnlHZXRNZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNC4xLjcgUmVmbGVjdC5nZXRPd25NZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0IFssIHByb3BlcnR5S2V5XSlcclxuICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI3JlZmxlY3QtZ2V0b3dubWV0YWRhdGFcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBHZXRzIHRoZSBtZXRhZGF0YSB2YWx1ZSBmb3IgdGhlIHByb3ZpZGVkIG1ldGFkYXRhIGtleSBvbiB0aGUgdGFyZ2V0IG9iamVjdC5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcmV0dXJucyBUaGUgbWV0YWRhdGEgdmFsdWUgZm9yIHRoZSBtZXRhZGF0YSBrZXkgaWYgZm91bmQ7IG90aGVyd2lzZSwgYHVuZGVmaW5lZGAuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgfVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE93bk1ldGFkYXRhKG1ldGFkYXRhS2V5OiBhbnksIHRhcmdldDogYW55KTogYW55O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIEdldHMgdGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgcHJvdmlkZWQgbWV0YWRhdGEga2V5IG9uIHRoZSB0YXJnZXQgb2JqZWN0LlxyXG4gICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxyXG4gICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxyXG4gICAgICAqIEByZXR1cm5zIFRoZSBtZXRhZGF0YSB2YWx1ZSBmb3IgdGhlIG1ldGFkYXRhIGtleSBpZiBmb3VuZDsgb3RoZXJ3aXNlLCBgdW5kZWZpbmVkYC5cclxuICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xyXG4gICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxyXG4gICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xyXG4gICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIik7XHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRPd25NZXRhZGF0YShtZXRhZGF0YUtleTogYW55LCB0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCk6IGFueTtcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBHZXRzIHRoZSBtZXRhZGF0YSB2YWx1ZSBmb3IgdGhlIHByb3ZpZGVkIG1ldGFkYXRhIGtleSBvbiB0aGUgdGFyZ2V0IG9iamVjdC5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxyXG4gICAgICAqIEByZXR1cm5zIFRoZSBtZXRhZGF0YSB2YWx1ZSBmb3IgdGhlIG1ldGFkYXRhIGtleSBpZiBmb3VuZDsgb3RoZXJ3aXNlLCBgdW5kZWZpbmVkYC5cclxuICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xyXG4gICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxyXG4gICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xyXG4gICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgICAgIGNvbnN0cnVjdG9yKHApIHsgfVxyXG4gICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cclxuICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cclxuICAgICAgKiAgICAgfVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIik7XHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRPd25NZXRhZGF0YShtZXRhZGF0YUtleTogYW55LCB0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk/OiBzdHJpbmcgfCBzeW1ib2wpOiBhbnkge1xyXG4gICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKSBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xyXG4gICAgICAgIHJldHVybiBPcmRpbmFyeUdldE93bk1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA0LjEuOCBSZWZsZWN0LmdldE1ldGFkYXRhS2V5cyh0YXJnZXQgWywgcHJvcGVydHlLZXldKVxyXG4gICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jcmVmbGVjdC1nZXRtZXRhZGF0YWtleXNcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBHZXRzIHRoZSBtZXRhZGF0YSBrZXlzIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3Qgb3IgaXRzIHByb3RvdHlwZSBjaGFpbi5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxyXG4gICAgICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHVuaXF1ZSBtZXRhZGF0YSBrZXlzLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhS2V5cyhFeGFtcGxlKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhS2V5cyh0YXJnZXQ6IGFueSk6IGFueVtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIEdldHMgdGhlIG1ldGFkYXRhIGtleXMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdCBvciBpdHMgcHJvdG90eXBlIGNoYWluLlxyXG4gICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdGhlIG1ldGFkYXRhIGlzIGRlZmluZWQuXHJcbiAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXHJcbiAgICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgdW5pcXVlIG1ldGFkYXRhIGtleXMuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcclxuICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xyXG4gICAgICAqXHJcbiAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhS2V5cyhFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGFLZXlzKEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGFLZXlzKEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhS2V5cyhFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIik7XHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNZXRhZGF0YUtleXModGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpOiBhbnlbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBHZXRzIHRoZSBtZXRhZGF0YSBrZXlzIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3Qgb3IgaXRzIHByb3RvdHlwZSBjaGFpbi5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxyXG4gICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXHJcbiAgICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgdW5pcXVlIG1ldGFkYXRhIGtleXMuXHJcbiAgICAgICogQGV4YW1wbGVcclxuICAgICAgKlxyXG4gICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcclxuICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcclxuICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xyXG4gICAgICAqXHJcbiAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cclxuICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhS2V5cyhFeGFtcGxlKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGFLZXlzKEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YUtleXMoRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YUtleXMoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGFLZXlzKEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhS2V5cyh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk/OiBzdHJpbmcgfCBzeW1ib2wpOiBhbnlbXSB7XHJcbiAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcbiAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpIHByb3BlcnR5S2V5ID0gVG9Qcm9wZXJ0eUtleShwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgcmV0dXJuIE9yZGluYXJ5TWV0YWRhdGFLZXlzKHRhcmdldCwgcHJvcGVydHlLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDQuMS45IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGFLZXlzKHRhcmdldCBbLCBwcm9wZXJ0eUtleV0pXHJcbiAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNyZWZsZWN0LWdldG93bm1ldGFkYXRhXHJcblxyXG4gICAgLyoqXHJcbiAgICAgICogR2V0cyB0aGUgdW5pcXVlIG1ldGFkYXRhIGtleXMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdC5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxyXG4gICAgICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHVuaXF1ZSBtZXRhZGF0YSBrZXlzLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhS2V5cyhFeGFtcGxlKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE93bk1ldGFkYXRhS2V5cyh0YXJnZXQ6IGFueSk6IGFueVtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIEdldHMgdGhlIHVuaXF1ZSBtZXRhZGF0YSBrZXlzIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3QuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cclxuICAgICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiB1bmlxdWUgbWV0YWRhdGEga2V5cy5cclxuICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xyXG4gICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxyXG4gICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xyXG4gICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XHJcbiAgICAgICogICAgIH1cclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGFLZXlzKEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YUtleXMoRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YUtleXMoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGFLZXlzKEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE93bk1ldGFkYXRhS2V5cyh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCk6IGFueVtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIEdldHMgdGhlIHVuaXF1ZSBtZXRhZGF0YSBrZXlzIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3QuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxyXG4gICAgICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHVuaXF1ZSBtZXRhZGF0YSBrZXlzLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XHJcbiAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XHJcbiAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YUtleXMoRXhhbXBsZSk7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhS2V5cyhFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGFLZXlzKEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGFLZXlzKEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxyXG4gICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhS2V5cyhFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIik7XHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRPd25NZXRhZGF0YUtleXModGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5Pzogc3RyaW5nIHwgc3ltYm9sKTogYW55W10ge1xyXG4gICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKSBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xyXG4gICAgICAgIHJldHVybiBPcmRpbmFyeU93bk1ldGFkYXRhS2V5cyh0YXJnZXQsIHByb3BlcnR5S2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA0LjEuMTAgUmVmbGVjdC5kZWxldGVNZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0IFssIHByb3BlcnR5S2V5XSlcclxuICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI3JlZmxlY3QtZGVsZXRlbWV0YWRhdGFcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBEZWxldGVzIHRoZSBtZXRhZGF0YSBlbnRyeSBmcm9tIHRoZSB0YXJnZXQgb2JqZWN0IHdpdGggdGhlIHByb3ZpZGVkIGtleS5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1ldGFkYXRhIGVudHJ5IHdhcyBmb3VuZCBhbmQgZGVsZXRlZDsgb3RoZXJ3aXNlLCBmYWxzZS5cclxuICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUpO1xyXG4gICAgICAqXHJcbiAgICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVsZXRlTWV0YWRhdGEobWV0YWRhdGFLZXk6IGFueSwgdGFyZ2V0OiBhbnkpOiBib29sZWFuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIERlbGV0ZXMgdGhlIG1ldGFkYXRhIGVudHJ5IGZyb20gdGhlIHRhcmdldCBvYmplY3Qgd2l0aCB0aGUgcHJvdmlkZWQga2V5LlxyXG4gICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cclxuICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxyXG4gICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxyXG4gICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbWV0YWRhdGEgZW50cnkgd2FzIGZvdW5kIGFuZCBkZWxldGVkOyBvdGhlcndpc2UsIGZhbHNlLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XHJcbiAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cclxuICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cclxuICAgICAgKiAgICAgfVxyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZU1ldGFkYXRhKG1ldGFkYXRhS2V5OiBhbnksIHRhcmdldDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAgKiBEZWxldGVzIHRoZSBtZXRhZGF0YSBlbnRyeSBmcm9tIHRoZSB0YXJnZXQgb2JqZWN0IHdpdGggdGhlIHByb3ZpZGVkIGtleS5cclxuICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXHJcbiAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cclxuICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxyXG4gICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbWV0YWRhdGEgZW50cnkgd2FzIGZvdW5kIGFuZCBkZWxldGVkOyBvdGhlcndpc2UsIGZhbHNlLlxyXG4gICAgICAqIEBleGFtcGxlXHJcbiAgICAgICpcclxuICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XHJcbiAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XHJcbiAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XHJcbiAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxyXG4gICAgICAqICAgICB9XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XHJcbiAgICAgICpcclxuICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xyXG4gICAgICAqXHJcbiAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXHJcbiAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcclxuICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZU1ldGFkYXRhKG1ldGFkYXRhS2V5OiBhbnksIHRhcmdldDogYW55LCBwcm9wZXJ0eUtleT86IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKSBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhTWFwID0gR2V0T3JDcmVhdGVNZXRhZGF0YU1hcCh0YXJnZXQsIHByb3BlcnR5S2V5LCAvKkNyZWF0ZSovIGZhbHNlKTtcclxuICAgICAgICBpZiAoSXNVbmRlZmluZWQobWV0YWRhdGFNYXApKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKCFtZXRhZGF0YU1hcC5kZWxldGUobWV0YWRhdGFLZXkpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKG1ldGFkYXRhTWFwLnNpemUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBjb25zdCB0YXJnZXRNZXRhZGF0YSA9IE1ldGFkYXRhLmdldCh0YXJnZXQpO1xyXG4gICAgICAgIHRhcmdldE1ldGFkYXRhLmRlbGV0ZShwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgaWYgKHRhcmdldE1ldGFkYXRhLnNpemUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBNZXRhZGF0YS5kZWxldGUodGFyZ2V0KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBEZWNvcmF0ZUNvbnN0cnVjdG9yKGRlY29yYXRvcnM6IENsYXNzRGVjb3JhdG9yW10sIHRhcmdldDogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcclxuICAgICAgICAgICAgY29uc3QgZGVjb3JhdG9yID0gZGVjb3JhdG9yc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgZGVjb3JhdGVkID0gZGVjb3JhdG9yKHRhcmdldCk7XHJcbiAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQoZGVjb3JhdGVkKSAmJiAhSXNOdWxsKGRlY29yYXRlZCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICghSXNDb25zdHJ1Y3RvcihkZWNvcmF0ZWQpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSA8RnVuY3Rpb24+ZGVjb3JhdGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gRGVjb3JhdGVQcm9wZXJ0eShkZWNvcmF0b3JzOiBNZW1iZXJEZWNvcmF0b3JbXSwgdGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIGRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvciB8IHVuZGVmaW5lZCk6IFByb3BlcnR5RGVzY3JpcHRvciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcclxuICAgICAgICAgICAgY29uc3QgZGVjb3JhdG9yID0gZGVjb3JhdG9yc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgZGVjb3JhdGVkID0gZGVjb3JhdG9yKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpO1xyXG4gICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKGRlY29yYXRlZCkgJiYgIUlzTnVsbChkZWNvcmF0ZWQpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KGRlY29yYXRlZCkpIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IgPSA8UHJvcGVydHlEZXNjcmlwdG9yPmRlY29yYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyAyLjEuMSBHZXRPckNyZWF0ZU1ldGFkYXRhTWFwKE8sIFAsIENyZWF0ZSlcclxuICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI2dldG9yY3JlYXRlbWV0YWRhdGFtYXBcclxuICAgIGZ1bmN0aW9uIEdldE9yQ3JlYXRlTWV0YWRhdGFNYXAoTzogYW55LCBQOiBzdHJpbmcgfCBzeW1ib2wgfCB1bmRlZmluZWQsIENyZWF0ZTogdHJ1ZSk6IE1hcDxhbnksIGFueT47XHJcbiAgICBmdW5jdGlvbiBHZXRPckNyZWF0ZU1ldGFkYXRhTWFwKE86IGFueSwgUDogc3RyaW5nIHwgc3ltYm9sIHwgdW5kZWZpbmVkLCBDcmVhdGU6IGZhbHNlKTogTWFwPGFueSwgYW55PiB8IHVuZGVmaW5lZDtcclxuICAgIGZ1bmN0aW9uIEdldE9yQ3JlYXRlTWV0YWRhdGFNYXAoTzogYW55LCBQOiBzdHJpbmcgfCBzeW1ib2wgfCB1bmRlZmluZWQsIENyZWF0ZTogYm9vbGVhbik6IE1hcDxhbnksIGFueT4gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCB0YXJnZXRNZXRhZGF0YSA9IE1ldGFkYXRhLmdldChPKTtcclxuICAgICAgICBpZiAoSXNVbmRlZmluZWQodGFyZ2V0TWV0YWRhdGEpKSB7XHJcbiAgICAgICAgICAgIGlmICghQ3JlYXRlKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0YXJnZXRNZXRhZGF0YSA9IG5ldyBfTWFwPHN0cmluZyB8IHN5bWJvbCB8IHVuZGVmaW5lZCwgTWFwPGFueSwgYW55Pj4oKTtcclxuICAgICAgICAgICAgTWV0YWRhdGEuc2V0KE8sIHRhcmdldE1ldGFkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG1ldGFkYXRhTWFwID0gdGFyZ2V0TWV0YWRhdGEuZ2V0KFApO1xyXG4gICAgICAgIGlmIChJc1VuZGVmaW5lZChtZXRhZGF0YU1hcCkpIHtcclxuICAgICAgICAgICAgaWYgKCFDcmVhdGUpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIG1ldGFkYXRhTWFwID0gbmV3IF9NYXA8YW55LCBhbnk+KCk7XHJcbiAgICAgICAgICAgIHRhcmdldE1ldGFkYXRhLnNldChQLCBtZXRhZGF0YU1hcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtZXRhZGF0YU1hcDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAzLjEuMS4xIE9yZGluYXJ5SGFzTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApXHJcbiAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNvcmRpbmFyeWhhc21ldGFkYXRhXHJcbiAgICBmdW5jdGlvbiBPcmRpbmFyeUhhc01ldGFkYXRhKE1ldGFkYXRhS2V5OiBhbnksIE86IGFueSwgUDogc3RyaW5nIHwgc3ltYm9sIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgaGFzT3duID0gT3JkaW5hcnlIYXNPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCk7XHJcbiAgICAgICAgaWYgKGhhc093bikgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gT3JkaW5hcnlHZXRQcm90b3R5cGVPZihPKTtcclxuICAgICAgICBpZiAoIUlzTnVsbChwYXJlbnQpKSByZXR1cm4gT3JkaW5hcnlIYXNNZXRhZGF0YShNZXRhZGF0YUtleSwgcGFyZW50LCBQKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gMy4xLjIuMSBPcmRpbmFyeUhhc093bk1ldGFkYXRhKE1ldGFkYXRhS2V5LCBPLCBQKVxyXG4gICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jb3JkaW5hcnloYXNvd25tZXRhZGF0YVxyXG4gICAgZnVuY3Rpb24gT3JkaW5hcnlIYXNPd25NZXRhZGF0YShNZXRhZGF0YUtleTogYW55LCBPOiBhbnksIFA6IHN0cmluZyB8IHN5bWJvbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhTWFwID0gR2V0T3JDcmVhdGVNZXRhZGF0YU1hcChPLCBQLCAvKkNyZWF0ZSovIGZhbHNlKTtcclxuICAgICAgICBpZiAoSXNVbmRlZmluZWQobWV0YWRhdGFNYXApKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFRvQm9vbGVhbihtZXRhZGF0YU1hcC5oYXMoTWV0YWRhdGFLZXkpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAzLjEuMy4xIE9yZGluYXJ5R2V0TWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApXHJcbiAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNvcmRpbmFyeWdldG1ldGFkYXRhXHJcbiAgICBmdW5jdGlvbiBPcmRpbmFyeUdldE1ldGFkYXRhKE1ldGFkYXRhS2V5OiBhbnksIE86IGFueSwgUDogc3RyaW5nIHwgc3ltYm9sIHwgdW5kZWZpbmVkKTogYW55IHtcclxuICAgICAgICBjb25zdCBoYXNPd24gPSBPcmRpbmFyeUhhc093bk1ldGFkYXRhKE1ldGFkYXRhS2V5LCBPLCBQKTtcclxuICAgICAgICBpZiAoaGFzT3duKSByZXR1cm4gT3JkaW5hcnlHZXRPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCk7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gT3JkaW5hcnlHZXRQcm90b3R5cGVPZihPKTtcclxuICAgICAgICBpZiAoIUlzTnVsbChwYXJlbnQpKSByZXR1cm4gT3JkaW5hcnlHZXRNZXRhZGF0YShNZXRhZGF0YUtleSwgcGFyZW50LCBQKTtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDMuMS40LjEgT3JkaW5hcnlHZXRPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUClcclxuICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5Z2V0b3dubWV0YWRhdGFcclxuICAgIGZ1bmN0aW9uIE9yZGluYXJ5R2V0T3duTWV0YWRhdGEoTWV0YWRhdGFLZXk6IGFueSwgTzogYW55LCBQOiBzdHJpbmcgfCBzeW1ib2wgfCB1bmRlZmluZWQpOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhTWFwID0gR2V0T3JDcmVhdGVNZXRhZGF0YU1hcChPLCBQLCAvKkNyZWF0ZSovIGZhbHNlKTtcclxuICAgICAgICBpZiAoSXNVbmRlZmluZWQobWV0YWRhdGFNYXApKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiBtZXRhZGF0YU1hcC5nZXQoTWV0YWRhdGFLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDMuMS41LjEgT3JkaW5hcnlEZWZpbmVPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTWV0YWRhdGFWYWx1ZSwgTywgUClcclxuICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5ZGVmaW5lb3dubWV0YWRhdGFcclxuICAgIGZ1bmN0aW9uIE9yZGluYXJ5RGVmaW5lT3duTWV0YWRhdGEoTWV0YWRhdGFLZXk6IGFueSwgTWV0YWRhdGFWYWx1ZTogYW55LCBPOiBhbnksIFA6IHN0cmluZyB8IHN5bWJvbCB8IHVuZGVmaW5lZCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhTWFwID0gR2V0T3JDcmVhdGVNZXRhZGF0YU1hcChPLCBQLCAvKkNyZWF0ZSovIHRydWUpO1xyXG4gICAgICAgIG1ldGFkYXRhTWFwLnNldChNZXRhZGF0YUtleSwgTWV0YWRhdGFWYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gMy4xLjYuMSBPcmRpbmFyeU1ldGFkYXRhS2V5cyhPLCBQKVxyXG4gICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jb3JkaW5hcnltZXRhZGF0YWtleXNcclxuICAgIGZ1bmN0aW9uIE9yZGluYXJ5TWV0YWRhdGFLZXlzKE86IGFueSwgUDogc3RyaW5nIHwgc3ltYm9sIHwgdW5kZWZpbmVkKTogYW55W10ge1xyXG4gICAgICAgIGNvbnN0IG93bktleXMgPSBPcmRpbmFyeU93bk1ldGFkYXRhS2V5cyhPLCBQKTtcclxuICAgICAgICBjb25zdCBwYXJlbnQgPSBPcmRpbmFyeUdldFByb3RvdHlwZU9mKE8pO1xyXG4gICAgICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHJldHVybiBvd25LZXlzO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudEtleXMgPSBPcmRpbmFyeU1ldGFkYXRhS2V5cyhwYXJlbnQsIFApO1xyXG4gICAgICAgIGlmIChwYXJlbnRLZXlzLmxlbmd0aCA8PSAwKSByZXR1cm4gb3duS2V5cztcclxuICAgICAgICBpZiAob3duS2V5cy5sZW5ndGggPD0gMCkgcmV0dXJuIHBhcmVudEtleXM7XHJcbiAgICAgICAgY29uc3Qgc2V0ID0gbmV3IF9TZXQ8YW55PigpO1xyXG4gICAgICAgIGNvbnN0IGtleXM6IGFueVtdID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Ygb3duS2V5cykge1xyXG4gICAgICAgICAgICBjb25zdCBoYXNLZXkgPSBzZXQuaGFzKGtleSk7XHJcbiAgICAgICAgICAgIGlmICghaGFzS2V5KSB7XHJcbiAgICAgICAgICAgICAgICBzZXQuYWRkKGtleSk7XHJcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBwYXJlbnRLZXlzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0tleSA9IHNldC5oYXMoa2V5KTtcclxuICAgICAgICAgICAgaWYgKCFoYXNLZXkpIHtcclxuICAgICAgICAgICAgICAgIHNldC5hZGQoa2V5KTtcclxuICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBrZXlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDMuMS43LjEgT3JkaW5hcnlPd25NZXRhZGF0YUtleXMoTywgUClcclxuICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5b3dubWV0YWRhdGFrZXlzXHJcbiAgICBmdW5jdGlvbiBPcmRpbmFyeU93bk1ldGFkYXRhS2V5cyhPOiBhbnksIFA6IHN0cmluZyB8IHN5bWJvbCB8IHVuZGVmaW5lZCk6IGFueVtdIHtcclxuICAgICAgICBjb25zdCBrZXlzOiBhbnlbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhTWFwID0gR2V0T3JDcmVhdGVNZXRhZGF0YU1hcChPLCBQLCAvKkNyZWF0ZSovIGZhbHNlKTtcclxuICAgICAgICBpZiAoSXNVbmRlZmluZWQobWV0YWRhdGFNYXApKSByZXR1cm4ga2V5cztcclxuICAgICAgICBjb25zdCBrZXlzT2JqID0gbWV0YWRhdGFNYXAua2V5cygpO1xyXG4gICAgICAgIGNvbnN0IGl0ZXJhdG9yID0gR2V0SXRlcmF0b3Ioa2V5c09iaik7XHJcbiAgICAgICAgbGV0IGsgPSAwO1xyXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBJdGVyYXRvclN0ZXAoaXRlcmF0b3IpO1xyXG4gICAgICAgICAgICBpZiAoIW5leHQpIHtcclxuICAgICAgICAgICAgICAgIGtleXMubGVuZ3RoID0gaztcclxuICAgICAgICAgICAgICAgIHJldHVybiBrZXlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRWYWx1ZSA9IEl0ZXJhdG9yVmFsdWUobmV4dCk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBrZXlzW2tdID0gbmV4dFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBrKys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIDYgRUNNQVNjcmlwdCBEYXRhIFR5cDBlcyBhbmQgVmFsdWVzXHJcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWRhdGEtdHlwZXMtYW5kLXZhbHVlc1xyXG4gICAgZnVuY3Rpb24gVHlwZSh4OiBhbnkpOiBUYWcge1xyXG4gICAgICAgIGlmICh4ID09PSBudWxsKSByZXR1cm4gVGFnLk51bGw7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlb2YgeCkge1xyXG4gICAgICAgICAgICBjYXNlIFwidW5kZWZpbmVkXCI6IHJldHVybiBUYWcuVW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOiByZXR1cm4gVGFnLkJvb2xlYW47XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjogcmV0dXJuIFRhZy5TdHJpbmc7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzeW1ib2xcIjogcmV0dXJuIFRhZy5TeW1ib2w7XHJcbiAgICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjogcmV0dXJuIFRhZy5OdW1iZXI7XHJcbiAgICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjogcmV0dXJuIHggPT09IG51bGwgPyBUYWcuTnVsbCA6IFRhZy5PYmplY3Q7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBUYWcuT2JqZWN0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyA2LjEgRUNNQVNjcmlwdCBMYW5ndWFnZSBUeXBlc1xyXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlc1xyXG4gICAgY29uc3QgZW51bSBUYWcge1xyXG4gICAgICAgIFVuZGVmaW5lZCxcclxuICAgICAgICBOdWxsLFxyXG4gICAgICAgIEJvb2xlYW4sXHJcbiAgICAgICAgU3RyaW5nLFxyXG4gICAgICAgIFN5bWJvbCxcclxuICAgICAgICBOdW1iZXIsXHJcbiAgICAgICAgT2JqZWN0XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNi4xLjEgVGhlIFVuZGVmaW5lZCBUeXBlXHJcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzLXVuZGVmaW5lZC10eXBlXHJcbiAgICBmdW5jdGlvbiBJc1VuZGVmaW5lZCh4OiBhbnkpOiB4IGlzIHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHggPT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyA2LjEuMiBUaGUgTnVsbCBUeXBlXHJcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzLW51bGwtdHlwZVxyXG4gICAgZnVuY3Rpb24gSXNOdWxsKHg6IGFueSk6IHggaXMgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHggPT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNi4xLjUgVGhlIFN5bWJvbCBUeXBlXHJcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzLXN5bWJvbC10eXBlXHJcbiAgICBmdW5jdGlvbiBJc1N5bWJvbCh4OiBhbnkpOiB4IGlzIHN5bWJvbCB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSBcInN5bWJvbFwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDYuMS43IFRoZSBPYmplY3QgVHlwZVxyXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LXR5cGVcclxuICAgIGZ1bmN0aW9uIElzT2JqZWN0PFQ+KHg6IFQgfCB1bmRlZmluZWQgfCBudWxsIHwgYm9vbGVhbiB8IHN0cmluZyB8IHN5bWJvbCB8IG51bWJlcik6IHggaXMgVCB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSBcIm9iamVjdFwiID8geCAhPT0gbnVsbCA6IHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNy4xIFR5cGUgQ29udmVyc2lvblxyXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdHlwZS1jb252ZXJzaW9uXHJcblxyXG4gICAgLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXHJcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b3ByaW1pdGl2ZVxyXG4gICAgZnVuY3Rpb24gVG9QcmltaXRpdmUoaW5wdXQ6IGFueSwgUHJlZmVycmVkVHlwZT86IFRhZyk6IHVuZGVmaW5lZCB8IG51bGwgfCBib29sZWFuIHwgc3RyaW5nIHwgc3ltYm9sIHwgbnVtYmVyIHtcclxuICAgICAgICBzd2l0Y2ggKFR5cGUoaW5wdXQpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgVGFnLlVuZGVmaW5lZDogcmV0dXJuIGlucHV0O1xyXG4gICAgICAgICAgICBjYXNlIFRhZy5OdWxsOiByZXR1cm4gaW5wdXQ7XHJcbiAgICAgICAgICAgIGNhc2UgVGFnLkJvb2xlYW46IHJldHVybiBpbnB1dDtcclxuICAgICAgICAgICAgY2FzZSBUYWcuU3RyaW5nOiByZXR1cm4gaW5wdXQ7XHJcbiAgICAgICAgICAgIGNhc2UgVGFnLlN5bWJvbDogcmV0dXJuIGlucHV0O1xyXG4gICAgICAgICAgICBjYXNlIFRhZy5OdW1iZXI6IHJldHVybiBpbnB1dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaGludDogXCJzdHJpbmdcIiB8IFwibnVtYmVyXCIgfCBcImRlZmF1bHRcIiA9IFByZWZlcnJlZFR5cGUgPT09IFRhZy5TdHJpbmcgPyBcInN0cmluZ1wiIDogUHJlZmVycmVkVHlwZSA9PT0gVGFnLk51bWJlciA/IFwibnVtYmVyXCIgOiBcImRlZmF1bHRcIjtcclxuICAgICAgICBjb25zdCBleG90aWNUb1ByaW0gPSBHZXRNZXRob2QoaW5wdXQsIHRvUHJpbWl0aXZlU3ltYm9sKTtcclxuICAgICAgICBpZiAoZXhvdGljVG9QcmltICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZXhvdGljVG9QcmltLmNhbGwoaW5wdXQsIGhpbnQpO1xyXG4gICAgICAgICAgICBpZiAoSXNPYmplY3QocmVzdWx0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gT3JkaW5hcnlUb1ByaW1pdGl2ZShpbnB1dCwgaGludCA9PT0gXCJkZWZhdWx0XCIgPyBcIm51bWJlclwiIDogaGludCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNy4xLjEuMSBPcmRpbmFyeVRvUHJpbWl0aXZlKE8sIGhpbnQpXHJcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vcmRpbmFyeXRvcHJpbWl0aXZlXHJcbiAgICBmdW5jdGlvbiBPcmRpbmFyeVRvUHJpbWl0aXZlKE86IGFueSwgaGludDogXCJzdHJpbmdcIiB8IFwibnVtYmVyXCIpOiB1bmRlZmluZWQgfCBudWxsIHwgYm9vbGVhbiB8IHN0cmluZyB8IHN5bWJvbCB8IG51bWJlciB7XHJcbiAgICAgICAgaWYgKGhpbnQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgY29uc3QgdG9TdHJpbmcgPSBPLnRvU3RyaW5nO1xyXG4gICAgICAgICAgICBpZiAoSXNDYWxsYWJsZSh0b1N0cmluZykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRvU3RyaW5nLmNhbGwoTyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdmFsdWVPZiA9IE8udmFsdWVPZjtcclxuICAgICAgICAgICAgaWYgKElzQ2FsbGFibGUodmFsdWVPZikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbHVlT2YuY2FsbChPKTtcclxuICAgICAgICAgICAgICAgIGlmICghSXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWVPZiA9IE8udmFsdWVPZjtcclxuICAgICAgICAgICAgaWYgKElzQ2FsbGFibGUodmFsdWVPZikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbHVlT2YuY2FsbChPKTtcclxuICAgICAgICAgICAgICAgIGlmICghSXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB0b1N0cmluZyA9IE8udG9TdHJpbmc7XHJcbiAgICAgICAgICAgIGlmIChJc0NhbGxhYmxlKHRvU3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdG9TdHJpbmcuY2FsbChPKTtcclxuICAgICAgICAgICAgICAgIGlmICghSXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNy4xLjIgVG9Cb29sZWFuKGFyZ3VtZW50KVxyXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLzIwMTYvI3NlYy10b2Jvb2xlYW5cclxuICAgIGZ1bmN0aW9uIFRvQm9vbGVhbihhcmd1bWVudDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICEhYXJndW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNy4xLjEyIFRvU3RyaW5nKGFyZ3VtZW50KVxyXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9zdHJpbmdcclxuICAgIGZ1bmN0aW9uIFRvU3RyaW5nKGFyZ3VtZW50OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIlwiICsgYXJndW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNy4xLjE0IFRvUHJvcGVydHlLZXkoYXJndW1lbnQpXHJcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b3Byb3BlcnR5a2V5XHJcbiAgICBmdW5jdGlvbiBUb1Byb3BlcnR5S2V5KGFyZ3VtZW50OiBhbnkpOiBzdHJpbmcgfCBzeW1ib2wge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IFRvUHJpbWl0aXZlKGFyZ3VtZW50LCBUYWcuU3RyaW5nKTtcclxuICAgICAgICBpZiAoSXNTeW1ib2woa2V5KSkgcmV0dXJuIGtleTtcclxuICAgICAgICByZXR1cm4gVG9TdHJpbmcoa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA3LjIgVGVzdGluZyBhbmQgQ29tcGFyaXNvbiBPcGVyYXRpb25zXHJcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10ZXN0aW5nLWFuZC1jb21wYXJpc29uLW9wZXJhdGlvbnNcclxuXHJcbiAgICAvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxyXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtaXNhcnJheVxyXG4gICAgZnVuY3Rpb24gSXNBcnJheShhcmd1bWVudDogYW55KTogYXJndW1lbnQgaXMgYW55W10ge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5XHJcbiAgICAgICAgICAgID8gQXJyYXkuaXNBcnJheShhcmd1bWVudClcclxuICAgICAgICAgICAgOiBhcmd1bWVudCBpbnN0YW5jZW9mIE9iamVjdFxyXG4gICAgICAgICAgICAgICAgPyBhcmd1bWVudCBpbnN0YW5jZW9mIEFycmF5XHJcbiAgICAgICAgICAgICAgICA6IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmd1bWVudCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyA3LjIuMyBJc0NhbGxhYmxlKGFyZ3VtZW50KVxyXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtaXNjYWxsYWJsZVxyXG4gICAgZnVuY3Rpb24gSXNDYWxsYWJsZShhcmd1bWVudDogYW55KTogYXJndW1lbnQgaXMgRnVuY3Rpb24ge1xyXG4gICAgICAgIC8vIE5PVEU6IFRoaXMgaXMgYW4gYXBwcm94aW1hdGlvbiBhcyB3ZSBjYW5ub3QgY2hlY2sgZm9yIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZC5cclxuICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3VtZW50ID09PSBcImZ1bmN0aW9uXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNy4yLjQgSXNDb25zdHJ1Y3Rvcihhcmd1bWVudClcclxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzY29uc3RydWN0b3JcclxuICAgIGZ1bmN0aW9uIElzQ29uc3RydWN0b3IoYXJndW1lbnQ6IGFueSk6IGFyZ3VtZW50IGlzIEZ1bmN0aW9uIHtcclxuICAgICAgICAvLyBOT1RFOiBUaGlzIGlzIGFuIGFwcHJveGltYXRpb24gYXMgd2UgY2Fubm90IGNoZWNrIGZvciBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZC5cclxuICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3VtZW50ID09PSBcImZ1bmN0aW9uXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNy4yLjcgSXNQcm9wZXJ0eUtleShhcmd1bWVudClcclxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzcHJvcGVydHlrZXlcclxuICAgIGZ1bmN0aW9uIElzUHJvcGVydHlLZXkoYXJndW1lbnQ6IGFueSk6IGFyZ3VtZW50IGlzIHN0cmluZyB8IHN5bWJvbCB7XHJcbiAgICAgICAgc3dpdGNoIChUeXBlKGFyZ3VtZW50KSkge1xyXG4gICAgICAgICAgICBjYXNlIFRhZy5TdHJpbmc6IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBjYXNlIFRhZy5TeW1ib2w6IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIDcuMyBPcGVyYXRpb25zIG9uIE9iamVjdHNcclxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9wZXJhdGlvbnMtb24tb2JqZWN0c1xyXG5cclxuICAgIC8vIDcuMy45IEdldE1ldGhvZChWLCBQKVxyXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0bWV0aG9kXHJcbiAgICBmdW5jdGlvbiBHZXRNZXRob2QoVjogYW55LCBQOiBhbnkpOiBGdW5jdGlvbiB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgZnVuYyA9IFZbUF07XHJcbiAgICAgICAgaWYgKGZ1bmMgPT09IHVuZGVmaW5lZCB8fCBmdW5jID09PSBudWxsKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmICghSXNDYWxsYWJsZShmdW5jKSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgIHJldHVybiBmdW5jO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDcuNCBPcGVyYXRpb25zIG9uIEl0ZXJhdG9yIE9iamVjdHNcclxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9wZXJhdGlvbnMtb24taXRlcmF0b3Itb2JqZWN0c1xyXG5cclxuICAgIGZ1bmN0aW9uIEdldEl0ZXJhdG9yPFQ+KG9iajogSXRlcmFibGU8VD4pOiBJdGVyYXRvcjxUPiB7XHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0gR2V0TWV0aG9kKG9iaiwgaXRlcmF0b3JTeW1ib2wpO1xyXG4gICAgICAgIGlmICghSXNDYWxsYWJsZShtZXRob2QpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCk7IC8vIGZyb20gQ2FsbFxyXG4gICAgICAgIGNvbnN0IGl0ZXJhdG9yID0gbWV0aG9kLmNhbGwob2JqKTtcclxuICAgICAgICBpZiAoIUlzT2JqZWN0KGl0ZXJhdG9yKSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgIHJldHVybiBpdGVyYXRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyA3LjQuNCBJdGVyYXRvclZhbHVlKGl0ZXJSZXN1bHQpXHJcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvMjAxNi8jc2VjLWl0ZXJhdG9ydmFsdWVcclxuICAgIGZ1bmN0aW9uIEl0ZXJhdG9yVmFsdWU8VD4oaXRlclJlc3VsdDogSXRlcmF0b3JSZXN1bHQ8VD4pOiBUIHtcclxuICAgICAgICByZXR1cm4gaXRlclJlc3VsdC52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA3LjQuNSBJdGVyYXRvclN0ZXAoaXRlcmF0b3IpXHJcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1pdGVyYXRvcnN0ZXBcclxuICAgIGZ1bmN0aW9uIEl0ZXJhdG9yU3RlcDxUPihpdGVyYXRvcjogSXRlcmF0b3I8VD4pOiBJdGVyYXRvclJlc3VsdDxUPiB8IGZhbHNlIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gZmFsc2UgOiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcclxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWl0ZXJhdG9yY2xvc2VcclxuICAgIGZ1bmN0aW9uIEl0ZXJhdG9yQ2xvc2U8VD4oaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+KSB7XHJcbiAgICAgICAgY29uc3QgZiA9IGl0ZXJhdG9yW1wicmV0dXJuXCJdO1xyXG4gICAgICAgIGlmIChmKSBmLmNhbGwoaXRlcmF0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDkuMSBPcmRpbmFyeSBPYmplY3QgSW50ZXJuYWwgTWV0aG9kcyBhbmQgSW50ZXJuYWwgU2xvdHNcclxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9yZGluYXJ5LW9iamVjdC1pbnRlcm5hbC1tZXRob2RzLWFuZC1pbnRlcm5hbC1zbG90c1xyXG5cclxuICAgIC8vIDkuMS4xLjEgT3JkaW5hcnlHZXRQcm90b3R5cGVPZihPKVxyXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb3JkaW5hcnlnZXRwcm90b3R5cGVvZlxyXG4gICAgZnVuY3Rpb24gT3JkaW5hcnlHZXRQcm90b3R5cGVPZihPOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pO1xyXG4gICAgICAgIGlmICh0eXBlb2YgTyAhPT0gXCJmdW5jdGlvblwiIHx8IE8gPT09IGZ1bmN0aW9uUHJvdG90eXBlKSByZXR1cm4gcHJvdG87XHJcblxyXG4gICAgICAgIC8vIFR5cGVTY3JpcHQgZG9lc24ndCBzZXQgX19wcm90b19fIGluIEVTNSwgYXMgaXQncyBub24tc3RhbmRhcmQuXHJcbiAgICAgICAgLy8gVHJ5IHRvIGRldGVybWluZSB0aGUgc3VwZXJjbGFzcyBjb25zdHJ1Y3Rvci4gQ29tcGF0aWJsZSBpbXBsZW1lbnRhdGlvbnNcclxuICAgICAgICAvLyBtdXN0IGVpdGhlciBzZXQgX19wcm90b19fIG9uIGEgc3ViY2xhc3MgY29uc3RydWN0b3IgdG8gdGhlIHN1cGVyY2xhc3MgY29uc3RydWN0b3IsXHJcbiAgICAgICAgLy8gb3IgZW5zdXJlIGVhY2ggY2xhc3MgaGFzIGEgdmFsaWQgYGNvbnN0cnVjdG9yYCBwcm9wZXJ0eSBvbiBpdHMgcHJvdG90eXBlIHRoYXRcclxuICAgICAgICAvLyBwb2ludHMgYmFjayB0byB0aGUgY29uc3RydWN0b3IuXHJcblxyXG4gICAgICAgIC8vIElmIHRoaXMgaXMgbm90IHRoZSBzYW1lIGFzIEZ1bmN0aW9uLltbUHJvdG90eXBlXV0sIHRoZW4gdGhpcyBpcyBkZWZpbmF0ZWx5IGluaGVyaXRlZC5cclxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBjYXNlIHdoZW4gaW4gRVM2IG9yIHdoZW4gdXNpbmcgX19wcm90b19fIGluIGEgY29tcGF0aWJsZSBicm93c2VyLlxyXG4gICAgICAgIGlmIChwcm90byAhPT0gZnVuY3Rpb25Qcm90b3R5cGUpIHJldHVybiBwcm90bztcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIHN1cGVyIHByb3RvdHlwZSBpcyBPYmplY3QucHJvdG90eXBlLCBudWxsLCBvciB1bmRlZmluZWQsIHRoZW4gd2UgY2Fubm90IGRldGVybWluZSB0aGUgaGVyaXRhZ2UuXHJcbiAgICAgICAgY29uc3QgcHJvdG90eXBlID0gTy5wcm90b3R5cGU7XHJcbiAgICAgICAgY29uc3QgcHJvdG90eXBlUHJvdG8gPSBwcm90b3R5cGUgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XHJcbiAgICAgICAgaWYgKHByb3RvdHlwZVByb3RvID09IG51bGwgfHwgcHJvdG90eXBlUHJvdG8gPT09IE9iamVjdC5wcm90b3R5cGUpIHJldHVybiBwcm90bztcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGNvbnN0cnVjdG9yIHdhcyBub3QgYSBmdW5jdGlvbiwgdGhlbiB3ZSBjYW5ub3QgZGV0ZXJtaW5lIHRoZSBoZXJpdGFnZS5cclxuICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9IHByb3RvdHlwZVByb3RvLmNvbnN0cnVjdG9yO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RydWN0b3IgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHByb3RvO1xyXG5cclxuICAgICAgICAvLyBJZiB3ZSBoYXZlIHNvbWUga2luZCBvZiBzZWxmLXJlZmVyZW5jZSwgdGhlbiB3ZSBjYW5ub3QgZGV0ZXJtaW5lIHRoZSBoZXJpdGFnZS5cclxuICAgICAgICBpZiAoY29uc3RydWN0b3IgPT09IE8pIHJldHVybiBwcm90bztcclxuXHJcbiAgICAgICAgLy8gd2UgaGF2ZSBhIHByZXR0eSBnb29kIGd1ZXNzIGF0IHRoZSBoZXJpdGFnZS5cclxuICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbmFpdmUgTWFwIHNoaW1cclxuICAgIGZ1bmN0aW9uIENyZWF0ZU1hcFBvbHlmaWxsKCk6IE1hcENvbnN0cnVjdG9yIHtcclxuICAgICAgICBjb25zdCBjYWNoZVNlbnRpbmVsID0ge307XHJcbiAgICAgICAgY29uc3QgYXJyYXlTZW50aW5lbDogYW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgY2xhc3MgTWFwSXRlcmF0b3I8SywgViwgUiBleHRlbmRzIChLIHwgViB8IFtLLCBWXSk+IGltcGxlbWVudHMgSXRlcmFibGVJdGVyYXRvcjxSPiB7XHJcbiAgICAgICAgICAgIHByaXZhdGUgX2tleXM6IEtbXTtcclxuICAgICAgICAgICAgcHJpdmF0ZSBfdmFsdWVzOiBWW107XHJcbiAgICAgICAgICAgIHByaXZhdGUgX2luZGV4ID0gMDtcclxuICAgICAgICAgICAgcHJpdmF0ZSBfc2VsZWN0b3I6IChrZXk6IEssIHZhbHVlOiBWKSA9PiBSO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihrZXlzOiBLW10sIHZhbHVlczogVltdLCBzZWxlY3RvcjogKGtleTogSywgdmFsdWU6IFYpID0+IFIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXMgPSBrZXlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzID0gdmFsdWVzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcIkBAaXRlcmF0b3JcIigpIHsgcmV0dXJuIHRoaXM7IH1cclxuICAgICAgICAgICAgW2l0ZXJhdG9yU3ltYm9sXSgpIHsgcmV0dXJuIHRoaXM7IH1cclxuICAgICAgICAgICAgbmV4dCgpOiBJdGVyYXRvclJlc3VsdDxSPiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4O1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLl9rZXlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3NlbGVjdG9yKHRoaXMuX2tleXNbaW5kZXhdLCB0aGlzLl92YWx1ZXNbaW5kZXhdKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggKyAxID49IHRoaXMuX2tleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMgPSBhcnJheVNlbnRpbmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBhcnJheVNlbnRpbmVsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5kZXgrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHJlc3VsdCwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiA8bmV2ZXI+dW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3coZXJyb3I6IGFueSk6IEl0ZXJhdG9yUmVzdWx0PFI+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5kZXggPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzID0gYXJyYXlTZW50aW5lbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBhcnJheVNlbnRpbmVsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuKHZhbHVlPzogUik6IEl0ZXJhdG9yUmVzdWx0PFI+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5kZXggPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzID0gYXJyYXlTZW50aW5lbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBhcnJheVNlbnRpbmVsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IDxuZXZlcj52YWx1ZSwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2xhc3MgTWFwPEssIFY+IHtcclxuICAgICAgICAgICAgcHJpdmF0ZSBfa2V5czogS1tdID0gW107XHJcbiAgICAgICAgICAgIHByaXZhdGUgX3ZhbHVlczogKFYgfCB1bmRlZmluZWQpW10gPSBbXTtcclxuICAgICAgICAgICAgcHJpdmF0ZSBfY2FjaGVLZXkgPSBjYWNoZVNlbnRpbmVsO1xyXG4gICAgICAgICAgICBwcml2YXRlIF9jYWNoZUluZGV4ID0gLTI7XHJcbiAgICAgICAgICAgIGdldCBzaXplKCkgeyByZXR1cm4gdGhpcy5fa2V5cy5sZW5ndGg7IH1cclxuICAgICAgICAgICAgaGFzKGtleTogSyk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZmluZChrZXksIC8qaW5zZXJ0Ki8gZmFsc2UpID49IDA7IH1cclxuICAgICAgICAgICAgZ2V0KGtleTogSyk6IFYgfCB1bmRlZmluZWQge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9maW5kKGtleSwgLyppbnNlcnQqLyBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXggPj0gMCA/IHRoaXMuX3ZhbHVlc1tpbmRleF0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0KGtleTogSywgdmFsdWU6IFYpOiB0aGlzIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZmluZChrZXksIC8qaW5zZXJ0Ki8gdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXNbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWxldGUoa2V5OiBLKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2ZpbmQoa2V5LCAvKmluc2VydCovIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuX2tleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBpbmRleCArIDE7IGkgPCBzaXplOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tpIC0gMV0gPSB0aGlzLl9rZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXNbaSAtIDFdID0gdGhpcy5fdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzLmxlbmd0aC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcy5sZW5ndGgtLTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSB0aGlzLl9jYWNoZUtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZUtleSA9IGNhY2hlU2VudGluZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSAtMjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xlYXIoKTogdm9pZCB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlS2V5ID0gY2FjaGVTZW50aW5lbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSAtMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBrZXlzKCkgeyByZXR1cm4gbmV3IE1hcEl0ZXJhdG9yKHRoaXMuX2tleXMsIHRoaXMuX3ZhbHVlcywgZ2V0S2V5KTsgfVxyXG4gICAgICAgICAgICB2YWx1ZXMoKSB7IHJldHVybiBuZXcgTWFwSXRlcmF0b3IodGhpcy5fa2V5cywgdGhpcy5fdmFsdWVzLCBnZXRWYWx1ZSk7IH1cclxuICAgICAgICAgICAgZW50cmllcygpIHsgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcih0aGlzLl9rZXlzLCB0aGlzLl92YWx1ZXMsIGdldEVudHJ5KTsgfVxyXG4gICAgICAgICAgICBcIkBAaXRlcmF0b3JcIigpIHsgcmV0dXJuIHRoaXMuZW50cmllcygpOyB9XHJcbiAgICAgICAgICAgIFtpdGVyYXRvclN5bWJvbF0oKSB7IHJldHVybiB0aGlzLmVudHJpZXMoKTsgfVxyXG4gICAgICAgICAgICBwcml2YXRlIF9maW5kKGtleTogSywgaW5zZXJ0PzogYm9vbGVhbik6IG51bWJlciB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2FjaGVLZXkgIT09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSB0aGlzLl9rZXlzLmluZGV4T2YodGhpcy5fY2FjaGVLZXkgPSBrZXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlSW5kZXggPCAwICYmIGluc2VydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSB0aGlzLl9rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlSW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRLZXk8SywgVj4oa2V5OiBLLCBfOiBWKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRWYWx1ZTxLLCBWPihfOiBLLCB2YWx1ZTogVikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRFbnRyeTxLLCBWPihrZXk6IEssIHZhbHVlOiBWKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBba2V5LCB2YWx1ZV0gYXMgW0ssIFZdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBuYWl2ZSBTZXQgc2hpbVxyXG4gICAgZnVuY3Rpb24gQ3JlYXRlU2V0UG9seWZpbGwoKTogU2V0Q29uc3RydWN0b3Ige1xyXG4gICAgICAgIHJldHVybiBjbGFzcyBTZXQ8VD4ge1xyXG4gICAgICAgICAgICBwcml2YXRlIF9tYXAgPSBuZXcgX01hcDxhbnksIGFueT4oKTtcclxuICAgICAgICAgICAgZ2V0IHNpemUoKSB7IHJldHVybiB0aGlzLl9tYXAuc2l6ZTsgfVxyXG4gICAgICAgICAgICBoYXModmFsdWU6IFQpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX21hcC5oYXModmFsdWUpOyB9XHJcbiAgICAgICAgICAgIGFkZCh2YWx1ZTogVCk6IFNldDxUPiB7IHJldHVybiB0aGlzLl9tYXAuc2V0KHZhbHVlLCB2YWx1ZSksIHRoaXM7IH1cclxuICAgICAgICAgICAgZGVsZXRlKHZhbHVlOiBUKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9tYXAuZGVsZXRlKHZhbHVlKTsgfVxyXG4gICAgICAgICAgICBjbGVhcigpOiB2b2lkIHsgdGhpcy5fbWFwLmNsZWFyKCk7IH1cclxuICAgICAgICAgICAga2V5cygpIHsgcmV0dXJuIHRoaXMuX21hcC5rZXlzKCk7IH1cclxuICAgICAgICAgICAgdmFsdWVzKCkgeyByZXR1cm4gdGhpcy5fbWFwLnZhbHVlcygpOyB9XHJcbiAgICAgICAgICAgIGVudHJpZXMoKSB7IHJldHVybiB0aGlzLl9tYXAuZW50cmllcygpOyB9XHJcbiAgICAgICAgICAgIFwiQEBpdGVyYXRvclwiKCkgeyByZXR1cm4gdGhpcy5rZXlzKCk7IH1cclxuICAgICAgICAgICAgW2l0ZXJhdG9yU3ltYm9sXSgpIHsgcmV0dXJuIHRoaXMua2V5cygpOyB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBuYWl2ZSBXZWFrTWFwIHNoaW1cclxuICAgIGZ1bmN0aW9uIENyZWF0ZVdlYWtNYXBQb2x5ZmlsbCgpOiBXZWFrTWFwQ29uc3RydWN0b3Ige1xyXG4gICAgICAgIGNvbnN0IFVVSURfU0laRSA9IDE2O1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSBIYXNoTWFwLmNyZWF0ZTxib29sZWFuPigpO1xyXG4gICAgICAgIGNvbnN0IHJvb3RLZXkgPSBDcmVhdGVVbmlxdWVLZXkoKTtcclxuICAgICAgICByZXR1cm4gY2xhc3MgV2Vha01hcDxLLCBWPiB7XHJcbiAgICAgICAgICAgIHByaXZhdGUgX2tleSA9IENyZWF0ZVVuaXF1ZUtleSgpO1xyXG4gICAgICAgICAgICBoYXModGFyZ2V0OiBLKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YWJsZSA9IEdldE9yQ3JlYXRlV2Vha01hcFRhYmxlPEs+KHRhcmdldCwgLypjcmVhdGUqLyBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUgIT09IHVuZGVmaW5lZCA/IEhhc2hNYXAuaGFzKHRhYmxlLCB0aGlzLl9rZXkpIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0KHRhcmdldDogSyk6IFYge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFibGUgPSBHZXRPckNyZWF0ZVdlYWtNYXBUYWJsZTxLPih0YXJnZXQsIC8qY3JlYXRlKi8gZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlICE9PSB1bmRlZmluZWQgPyBIYXNoTWFwLmdldCh0YWJsZSwgdGhpcy5fa2V5KSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXQodGFyZ2V0OiBLLCB2YWx1ZTogVik6IFdlYWtNYXA8SywgVj4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFibGUgPSBHZXRPckNyZWF0ZVdlYWtNYXBUYWJsZTxLPih0YXJnZXQsIC8qY3JlYXRlKi8gdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0YWJsZVt0aGlzLl9rZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWxldGUodGFyZ2V0OiBLKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YWJsZSA9IEdldE9yQ3JlYXRlV2Vha01hcFRhYmxlPEs+KHRhcmdldCwgLypjcmVhdGUqLyBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUgIT09IHVuZGVmaW5lZCA/IGRlbGV0ZSB0YWJsZVt0aGlzLl9rZXldIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xlYXIoKTogdm9pZCB7XHJcbiAgICAgICAgICAgICAgICAvLyBOT1RFOiBub3QgYSByZWFsIGNsZWFyLCBqdXN0IG1ha2VzIHRoZSBwcmV2aW91cyBkYXRhIHVucmVhY2hhYmxlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXkgPSBDcmVhdGVVbmlxdWVLZXkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIENyZWF0ZVVuaXF1ZUtleSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQga2V5OiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGRvIGtleSA9IFwiQEBXZWFrTWFwQEBcIiArIENyZWF0ZVVVSUQoKTtcclxuICAgICAgICAgICAgd2hpbGUgKEhhc2hNYXAuaGFzKGtleXMsIGtleSkpO1xyXG4gICAgICAgICAgICBrZXlzW2tleV0gPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gR2V0T3JDcmVhdGVXZWFrTWFwVGFibGU8Sz4odGFyZ2V0OiBLLCBjcmVhdGU6IHRydWUpOiBIYXNoTWFwPGFueT47XHJcbiAgICAgICAgZnVuY3Rpb24gR2V0T3JDcmVhdGVXZWFrTWFwVGFibGU8Sz4odGFyZ2V0OiBLLCBjcmVhdGU6IGZhbHNlKTogSGFzaE1hcDxhbnk+IHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGZ1bmN0aW9uIEdldE9yQ3JlYXRlV2Vha01hcFRhYmxlPEs+KHRhcmdldDogSywgY3JlYXRlOiBib29sZWFuKTogSGFzaE1hcDxhbnk+IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICAgICAgaWYgKCFoYXNPd24uY2FsbCh0YXJnZXQsIHJvb3RLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHJvb3RLZXksIHsgdmFsdWU6IEhhc2hNYXAuY3JlYXRlPGFueT4oKSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKDxhbnk+dGFyZ2V0KVtyb290S2V5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIEZpbGxSYW5kb21CeXRlcyhidWZmZXI6IEJ1ZmZlckxpa2UsIHNpemU6IG51bWJlcik6IEJ1ZmZlckxpa2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7ICsraSkgYnVmZmVyW2ldID0gTWF0aC5yYW5kb20oKSAqIDB4ZmYgfCAwO1xyXG4gICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gR2VuUmFuZG9tQnl0ZXMoc2l6ZTogbnVtYmVyKTogQnVmZmVyTGlrZSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgVWludDhBcnJheSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNyeXB0byAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoc2l6ZSkpIGFzIFVpbnQ4QXJyYXk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1zQ3J5cHRvICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KHNpemUpKSBhcyBVaW50OEFycmF5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZpbGxSYW5kb21CeXRlcyhuZXcgVWludDhBcnJheShzaXplKSwgc2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEZpbGxSYW5kb21CeXRlcyhuZXcgQXJyYXkoc2l6ZSksIHNpemUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gQ3JlYXRlVVVJRCgpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IEdlblJhbmRvbUJ5dGVzKFVVSURfU0laRSk7XHJcbiAgICAgICAgICAgIC8vIG1hcmsgYXMgcmFuZG9tIC0gUkZDIDQxMjIgwqcgNC40XHJcbiAgICAgICAgICAgIGRhdGFbNl0gPSBkYXRhWzZdICYgMHg0ZiB8IDB4NDA7XHJcbiAgICAgICAgICAgIGRhdGFbOF0gPSBkYXRhWzhdICYgMHhiZiB8IDB4ODA7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBvZmZzZXQgPSAwOyBvZmZzZXQgPCBVVUlEX1NJWkU7ICsrb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBieXRlID0gZGF0YVtvZmZzZXRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldCA9PT0gNCB8fCBvZmZzZXQgPT09IDYgfHwgb2Zmc2V0ID09PSA4KSByZXN1bHQgKz0gXCItXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnl0ZSA8IDE2KSByZXN1bHQgKz0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gYnl0ZS50b1N0cmluZygxNikudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB1c2VzIGEgaGV1cmlzdGljIHVzZWQgYnkgdjggYW5kIGNoYWtyYSB0byBmb3JjZSBhbiBvYmplY3QgaW50byBkaWN0aW9uYXJ5IG1vZGUuXHJcbiAgICBmdW5jdGlvbiBNYWtlRGljdGlvbmFyeTxUPihvYmo6IFQpOiBUIHtcclxuICAgICAgICAoPGFueT5vYmopLl9fID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGRlbGV0ZSAoPGFueT5vYmopLl9fO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGF0Y2ggZ2xvYmFsIFJlZmxlY3RcclxuICAgIChmdW5jdGlvbiAoX19nbG9iYWw6IGFueSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgX19nbG9iYWwuUmVmbGVjdCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICBpZiAoX19nbG9iYWwuUmVmbGVjdCAhPT0gUmVmbGVjdCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwIGluIFJlZmxlY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoUmVmbGVjdCwgcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX19nbG9iYWwuUmVmbGVjdFtwXSA9ICg8YW55PlJlZmxlY3QpW3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgX19nbG9iYWwuUmVmbGVjdCA9IFJlZmxlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfSkoXHJcbiAgICAgICAgdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6XHJcbiAgICAgICAgICAgIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6XHJcbiAgICAgICAgICAgICAgICBGdW5jdGlvbihcInJldHVybiB0aGlzO1wiKSgpKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vcmVmbGVjdC1tZXRhZGF0YS9SZWZsZWN0LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==